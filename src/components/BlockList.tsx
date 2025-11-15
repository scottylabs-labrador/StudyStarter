import React, { useEffect, useState } from 'react';
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';

interface BlockedUser {
  email: string;
  blockedByMe: boolean;
}

export function BlockList() {
  const { user } = useUser();
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  async function getBlocked() {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const docRef = doc(db, "Users", userId ? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const blockedData = docSnap.data().blocked;
        if (Array.isArray(blockedData)) {
          setBlocked(blockedData as BlockedUser[]);
        } else {
          setBlocked([]);
        }
      } else {
        console.log("No such document!");
        setBlocked([]);
      }
    } catch (err) {
      console.error(err);
      setBlocked([]);
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    getBlocked();
  }, [user]);

  const handleBlock = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const userToBlock = event.target.value.toLowerCase().trim();
    setInputValue(userToBlock);
  };

  const handleBlockSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userToBlock = inputValue.toLowerCase().trim();

    if (userToBlock === "" || !user) {
      return;
    }

    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) return;

    // Check if user is already in the list with blockedByMe: true
    const alreadyBlockedByMe = blocked.some((b) => b.email === userToBlock && b.blockedByMe);
    if (alreadyBlockedByMe) {
      setInputValue('');
      return;
    }

    try {
      // Check if the other user already has current user blocked
      const blockedUserDocRef = doc(db, "Users", userToBlock);
      const blockedUserDoc = await getDoc(blockedUserDocRef);
      let theirBlocked: BlockedUser[] = [];
      let theyBlockedMe = false;

      if (blockedUserDoc.exists()) {
        const theirBlockedData = blockedUserDoc.data().blocked;
        if (Array.isArray(theirBlockedData)) {
          theirBlocked = theirBlockedData as BlockedUser[];
          theyBlockedMe = theirBlocked.some((b) => b.email === userId);
        }
      }

      // Update current user's list
      const existingEntry = blocked.find((b) => b.email === userToBlock);
      let newBlocked: BlockedUser[];
      
      if (existingEntry) {
        // User already in list (with blockedByMe: false), update to true
        newBlocked = blocked.map((b) => 
          b.email === userToBlock ? { ...b, blockedByMe: true } : b
        );
      } else {
        // Add new entry with blockedByMe: true
        newBlocked = [...blocked, { email: userToBlock, blockedByMe: true }];
      }
      
      setBlocked(newBlocked);
      setInputValue('');
      
      const usersDocRef = doc(db, "Users", userId);
      await setDoc(usersDocRef, { blocked: newBlocked }, { merge: true });

      // Update the blocked user's document
      if (theyBlockedMe) {
        // They already have us blocked, update their entry to blockedByMe: true
        const theirNewBlocked = theirBlocked.map((b) =>
          b.email === userId ? { ...b, blockedByMe: true } : b
        );
        await setDoc(blockedUserDocRef, { blocked: theirNewBlocked }, { merge: true });
      } else {
        // They don't have us blocked yet, add with blockedByMe: false
        const theirNewBlocked: BlockedUser[] = [...theirBlocked, { email: userId, blockedByMe: false }];
        await setDoc(blockedUserDocRef, { blocked: theirNewBlocked }, { merge: true });
      }
    } catch (err) {
      console.error(err);
      // Revert state on error
      getBlocked();
    }
  };

  const handleUnblock = async (userToUnblock: string) => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) return;

    try {
      // Change blockedByMe from true to false instead of removing
      const newBlocked = blocked.map((usr) =>
        usr.email === userToUnblock ? { ...usr, blockedByMe: false } : usr
      );
      setBlocked(newBlocked);
      const usersDocRef = doc(db, "Users", userId);
      await setDoc(usersDocRef, { blocked: newBlocked }, { merge: true });
      // Note: We don't update the other user's list - it stays the same
    } catch (err) {
      console.error(err);
      // Revert state on error
      getBlocked();
    }
  };

  return (
    <div className="mt-8">
      <div className="p-0">
        <h1 className="text-black dark:text-white text-xl font-bold mb-2">Block Users</h1>
        <form onSubmit={handleBlockSubmit}>
          <input
            id="blockInput"
            className="text-black border border-gray-300 bg-lightInput dark:bg-darkInput rounded p-2 w-1/3 mb-0"
            type="text"
            value={inputValue}
            onChange={handleBlock}
            placeholder="Emails added here will not see groups you're in"
            required
          />
        </form>
      </div>
      <br></br>
      <h2 className="text-l font-bold mb-1 text-black dark:text-white">
        {blocked && blocked.filter((b) => b.blockedByMe).length > 0 ? "Blocked Students" : ''}
      </h2>
      <ul className="mt-212 space-y-2">
        {blocked && Array.isArray(blocked) && blocked
          .filter((blockedUser) => blockedUser.blockedByMe)
          .map((blockedUser) => (
            <li
              key={blockedUser.email}
              className="text-black dark:text-white bg-lightSidebar dark:bg-darkSidebar p-2 rounded w-1/3 flex justify-between items-center">
              <div className="truncate" style={{ maxWidth: "calc(100% - 2rem)" }}>
                {blockedUser.email}
              </div>
              <button
                onClick={() => handleUnblock(blockedUser.email)}
                className="text-lightgray-500 text-xl hover:text-red-500"
                aria-label={`Unblock ${blockedUser.email}`}
              >
                <strong>&times;</strong>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
