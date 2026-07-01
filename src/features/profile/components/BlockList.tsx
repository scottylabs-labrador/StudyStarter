import React, { useEffect, useState } from 'react';
import { useUser } from "~/lib/auth-client";
import { useConfirm } from '~/components/ui/ConfirmContext';
import { removeParticipantFromSharedGroups } from '~/features/groups/services/groupService';
import {
  addBlockedByThem,
  defaultBlockedUsers,
  getUserBlockingState,
  removeBlockedByThem,
  updateUserBlockingState,
} from '~/features/profile/services/profileService';
import type { BlockedUsers } from '~/features/profile/types';
import { deleteFromCal, setupGoogleApi, isCalendarApiReady, hasCalendarAccess, requestCalendarAccessInteractive } from '~/helpers/calendar_helper';

export function BlockList() {
  const { user } = useUser();
  const [blocked, setBlocked] = useState<BlockedUsers>(defaultBlockedUsers);
  const [groups, setGroups] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const confirm = useConfirm();

  async function getBlocked() {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      if (!userId) {
        return;
      }
      const blockingState = await getUserBlockingState(userId);
      setBlocked(blockingState.blocked);
      setGroups(blockingState.joinedGroups);
    } catch (err) {
      console.error(err);
      setBlocked(defaultBlockedUsers);
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    getBlocked();
  }, [user]);

  useEffect(() => {
    setupGoogleApi().catch((err) => {
      console.warn("Failed to initialize Google API:", err);
    });
  }, []);

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

    const alreadyBlockedByMe = blocked.blockedByMe.some((b) => b === userToBlock);
    if (alreadyBlockedByMe) {
      setInputValue('');
      return;
    }

    try {
      const blockedUserState = await getUserBlockingState(userToBlock);
      let updatedGroups = groups;
      let calendarAuthPromise: Promise<void> | null = null;
      if (isCalendarApiReady() && !hasCalendarAccess()) {
        calendarAuthPromise = requestCalendarAccessInteractive().catch((err) => {
          console.warn("Calendar auth failed:", err);
        });
      }

      const sharedGroups = groups.filter((groupId) => (
        blockedUserState.joinedGroups.includes(groupId)
      ));
      const numShared = sharedGroups.length;
      if (numShared > 0) {
        const ok = await confirm(`You are currently in ${numShared} group${numShared === 1 ? "" : "s"} with ${userToBlock}. You will be removed from ${numShared === 1 ? "this group" : "these groups"} if you continue.`);
        if (!ok) {
          return;
        }
        if (calendarAuthPromise) {
          await calendarAuthPromise;
        }
        const removal = await removeParticipantFromSharedGroups({
          currentGroupIds: groups,
          targetGroupIds: blockedUserState.joinedGroups,
          userEmail: userId,
        });
        updatedGroups = removal.remainingGroupIds;
        await Promise.all(removal.eventIdsToDelete.map(deleteFromCal));
      }

      await addBlockedByThem({ targetUserId: userToBlock, currentUserId: userId });

      const newBlocked: BlockedUsers = {
        blockedByMe: blocked.blockedByMe.concat([userToBlock]),
        blockedByThem: blocked.blockedByThem,
      };
      
      setBlocked(newBlocked);
      setGroups(updatedGroups);
      setInputValue('');

      await updateUserBlockingState({
        userId,
        blocked: newBlocked,
        joinedGroups: updatedGroups,
      });
    } catch (err) {
      console.error(err);
      getBlocked();
    }
  };

  const handleUnblock = async (userToUnblock: string) => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) return;

    try {
      await removeBlockedByThem({ targetUserId: userToUnblock, currentUserId: userId });

      const newBlocked: BlockedUsers = {
        blockedByMe: blocked.blockedByMe.filter((u) => u !== userToUnblock),
        blockedByThem: blocked.blockedByThem,
      };
      
      setBlocked(newBlocked);
      setInputValue('');

      await updateUserBlockingState({ userId, blocked: newBlocked });
    } catch (err) {
      console.error(err);
      getBlocked();
    }
  };

  return (
    <div className="mt-8">
      <div className="p-0">
        <h1 className="section-heading">Block Users</h1>
        <form onSubmit={handleBlockSubmit}>
          <input
            id="blockInput"
            className="course-search-input"
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
            className="button-primary mt-2 w-full"
          >
            Block User
          </button>
        </form>
      </div>
      <br />
      <h2 className="text-l font-bold mb-1 text-black dark:text-white">
        {blocked.blockedByMe.length > 0 ? "Blocked Students" : ''}
      </h2>
      <ul className="mt-212 space-y-2">
        {blocked.blockedByMe.map((blockedUser) => (
            <li
              key={blockedUser}
              className="class-list-item">
              <div className="class-list-text">
                {blockedUser}
              </div>
              <button
                onClick={() => handleUnblock(blockedUser)}
                className="unblock-button"
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
