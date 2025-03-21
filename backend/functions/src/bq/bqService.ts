import {BigQuery} from "@google-cloud/bigquery";

const bq = new BigQuery();

const DATASET = "live";
enum Tables {
  COURSES = "courses",
  JOIN = "join_event",
  GROUPS = "study_groups",
  USER = "user",
}

export const logJoinEvent = async (isJoinEvent: boolean, email: string,
  groupId: string) => {
  const tstamp = new Date().toISOString();
  const row = {
    email: email,
    group_id: groupId,
    is_creation_event: false,
    is_leave_event: !isJoinEvent,
    event_date: tstamp,
  };
  bq.dataset(DATASET).table(Tables.JOIN).insert(row);
};
