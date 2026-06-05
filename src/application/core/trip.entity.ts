import { TripStatus } from "../dto/trip.dto";

interface TripProps {
  destination: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  status: keyof typeof TripStatus;
}

export class Trip {
  private constructor(
    public readonly id: string,
    private props: TripProps,
  ) {}

  static restore(props: TripProps & { id: string }): Trip {
    return new Trip(props.id, props);
  }

  static create(id: string, props: TripProps): Trip {
    return new Trip(id, props);
  }

  get destination(): string {
    return this.props.destination;
  }

  get startsAt(): Date {
    return this.props.startsAt;
  }

  get endsAt(): Date {
    return this.props.endsAt;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): TripStatus {
    return this.props.status as TripStatus;
  }

  canBeEdited(status?: TripStatus): boolean {
    const validStatuses = new Set([TripStatus.PLANNED, TripStatus.CONFIRMED]);
    return validStatuses.has(status ?? (this.props.status as TripStatus));
  }

  updateStatus(status: TripStatus): void {
    if (!this.canBeEdited(status)) {
      return;
    }

    this.props.status = status;
  }

  update(destination: string, startsAt: Date, endsAt: Date): void {
    if (destination.trim() === "") return;
    this.props.destination = destination;
    this.props.startsAt = startsAt;
    this.props.endsAt = endsAt;
  }
}
