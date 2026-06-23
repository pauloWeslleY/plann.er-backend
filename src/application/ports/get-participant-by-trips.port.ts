import { type ManyTripsByParticipantDTO } from "../dto/trip.dto";

export interface GetParticipantByTripsPort {
  execute(input: {
    participantId: string;
  }): Promise<ManyTripsByParticipantDTO[]>;
}
