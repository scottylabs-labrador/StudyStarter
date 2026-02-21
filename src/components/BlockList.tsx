import React, { useEffect, useState } from 'react';
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { useConfirm } from './ConfirmContext';

export interface BlockedUsers {
  blockedByMe: string[]
  blockedByThem: string[]
}

export function BlockList() {
  const { user } = useUser();
  const [blocked, setBlocked] = useState<BlockedUsers>({blockedByMe: [], blockedByThem:[]});
  const [groups, setGroups] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const confirm = useConfirm();

  async function getBlocked() {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const docRef = doc(db, "Users", userId ? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        const blockedData = data.blocked;
        if (blockedData) {
          setBlocked(blockedData as BlockedUsers);
        } else {
          setBlocked({blockedByMe: [], blockedByThem:[]});
        }
        const userGroups = data.joinedGroups;
        if (userGroups) {
          setGroups(userGroups);
        } else {
          setGroups([])
        }
      } else {
        console.log("No such document!");
        setBlocked({blockedByMe: [], blockedByThem:[]});
      }
    } catch (err) {
      console.error(err);
      setBlocked({blockedByMe: [], blockedByThem:[]});
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
    console.log("hi");

    if (userToBlock === "" || !user) {
      return;
    }

    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) return;

    // Check if user is already in the blockedByMe list
    const alreadyBlockedByMe = blocked.blockedByMe.some((b) => b === userToBlock);
    if (alreadyBlockedByMe) {
      setInputValue('');
      return;
    }

    try {
      // Check if the other user already has current user blocked
      const blockedUserDocRef = doc(db, "Users", userToBlock);
      const blockedUserDoc = await getDoc(blockedUserDocRef);
      let theirBlocked: BlockedUsers = {blockedByMe: [], blockedByThem: []};
      let newGroups = [];

      if (blockedUserDoc.exists()) {
        // if blocked user already a user, update blocked and check shared groups
        const data = blockedUserDoc.data();
        const theirBlockedData = data.blocked;
        const theirGroups: string[] = data.joinedGroups;
        const sharedGroups = groups.filter(g => theirGroups.includes(g));
        const numShared = sharedGroups.length;
        if (numShared > 0) {
          const ok = await confirm(`You are currently in ${numShared} group${numShared == 1 ? "" : "s"} with ${userToBlock}. You will be removed from ${numShared == 1 ? "this group" : "these groups"} if you continue.`);
          if (!ok) {
            return;   // <- simply stop the function
          }
          for (const g of groups) {
            if (theirGroups.includes(g)) {
              const toRemoveDocRef = doc(db, "Study Groups", g);
              const toRemoveDoc = await getDoc(toRemoveDocRef);
              if (toRemoveDoc.exists()) {
                const groupData = toRemoveDoc.data();
                const groupParticipants = groupData.participantDetails;
                let newParticipants = groupParticipants.filter((p) => p.email != userId);
                await setDoc(toRemoveDocRef, { participantDetails: newParticipants }, { merge: true });
              } else {
                console.log("broken");
              }
            } else {
              newGroups.push(g);
            }
          }
        }

        if (theirBlockedData) {
          theirBlocked = theirBlockedData as BlockedUsers;
        } else {
          theirBlocked = {blockedByMe: [], blockedByThem: []}
        }
        theirBlocked.blockedByThem.push(userId)
        let newTheirBlocked: BlockedUsers = {blockedByMe: theirBlocked.blockedByMe, blockedByThem: theirBlocked.blockedByThem};
        // Update the blocked user's document
        await setDoc(blockedUserDocRef, { blocked: newTheirBlocked }, { merge: true });
      } else {
        // not a user yet, create a user to add blocking
        let newTheirBlocked: BlockedUsers = {blockedByMe: [], blockedByThem: [userId]};
        await setDoc(blockedUserDocRef, { blocked: newTheirBlocked }, { merge: true });
      }

      let newBlockedByMe = blocked.blockedByMe.concat([userToBlock])

      let newBlocked: BlockedUsers = {blockedByMe: newBlockedByMe, blockedByThem: blocked.blockedByThem};
      
      setBlocked(newBlocked);
      setGroups(newGroups);
      setInputValue('');
      
      const usersDocRef = doc(db, "Users", userId);
      await setDoc(usersDocRef, { blocked: newBlocked, joinedGroups: newGroups }, { merge: true });
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
      // Check if the other user already has current user blocked
      const blockedUserDocRef = doc(db, "Users", userToUnblock);
      const blockedUserDoc = await getDoc(blockedUserDocRef);
      let theirBlocked: BlockedUsers = {blockedByMe: [], blockedByThem: []};

      if (blockedUserDoc.exists()) {
        const theirBlockedData = blockedUserDoc.data().blocked;
        if (theirBlockedData) {
          theirBlocked = theirBlockedData as BlockedUsers;
        } else {
          theirBlocked = {blockedByMe: [], blockedByThem: []}
        }
        let newTheirBlockedByThem = theirBlocked.blockedByThem.filter((u) => u != userId)
        let newTheirBlocked: BlockedUsers = {blockedByMe: theirBlocked.blockedByMe, blockedByThem: newTheirBlockedByThem};
        // Update the blocked user's document
        await setDoc(blockedUserDocRef, { blocked: newTheirBlocked }, { merge: true });
      }

      let newBlockedByMe = blocked.blockedByMe.filter((u) => u != userToUnblock)

      let newBlocked: BlockedUsers = {blockedByMe: newBlockedByMe, blockedByThem: blocked.blockedByThem};
      
      setBlocked(newBlocked);
      setInputValue('');
      
      const usersDocRef = doc(db, "Users", userId);
      await setDoc(usersDocRef, { blocked: newBlocked }, { merge: true });
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
            pattern='[A-Za-z]*@andrew.cmu.edu'
            title='"<id>@andrew.cmu.edu"'
            value={inputValue}
            onChange={handleBlock}
            placeholder="Emails added here will not see groups you're in"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 w-1/3 rounded bg-lightbg dark:bg-darkbg hover:bg-lightSelected dark:hover:bg-darkSelected px-4 py-2 font-bold text-black dark:text-white"
          >
            Block User
          </button>
        </form>
      </div>
      <br></br>
      <h2 className="text-l font-bold mb-1 text-black dark:text-white">
        {blocked.blockedByMe.length > 0 ? "Blocked Students" : ''}
      </h2>
      <ul className="mt-212 space-y-2">
        {blocked.blockedByMe.map((blockedUser) => (
            <li
              key={blockedUser}
              className="text-black dark:text-white bg-lightSidebar dark:bg-darkSidebar p-2 rounded w-1/3 flex justify-between items-center">
              <div className="truncate" style={{ maxWidth: "calc(100% - 2rem)" }}>
                {blockedUser}
              </div>
              <button
                onClick={() => handleUnblock(blockedUser)}
                className="text-lightgray-500 text-xl hover:text-red-500"
                aria-label={`Unblock ${blockedUser}`}
              >
                <strong>&times;</strong>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
