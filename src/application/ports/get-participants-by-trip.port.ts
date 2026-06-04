import { type GetParticipantDTO } from "../dto/participant.dto";

export interface GetParticipantsByTripPort {
  execute(input: { tripId: string }): Promise<GetParticipantDTO[]>;
}
