export interface ConfirmTripPort {
  execute(input: { tripId: string }): Promise<{ url: string }>;
}
