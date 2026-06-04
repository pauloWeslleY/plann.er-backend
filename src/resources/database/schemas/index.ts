import * as ActivitiesTable from "./activity.table";
import * as AuthTable from "./auth.table";
import * as LinkTable from "./link.table";
import * as ParticipantRelations from "./participant.relations";
import * as ParticipantTable from "./participant.table";
import * as ParticipantsTripsTable from "./participants-trips.table";
import * as TripRelations from "./trip.relations";
import * as TripTable from "./trip.table";

export const schema = {
  ...TripTable,
  ...TripRelations,
  ...ParticipantTable,
  ...ParticipantRelations,
  ...ParticipantsTripsTable,
  ...AuthTable,
  ...LinkTable,
  ...ActivitiesTable,
};
