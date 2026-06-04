interface ParticipantProps {
  tripId: string;
  name: string | null;
  email: string;
  isConfirmed: boolean;
}

export class Participant {
  private constructor(
    public readonly id: string,
    private props: ParticipantProps,
  ) {}

  static restore(id: string, props: ParticipantProps): Participant {
    return new Participant(id, props);
  }

  get tripId(): string {
    return this.props.tripId;
  }

  isConfirmed(): boolean {
    return this.props.isConfirmed;
  }

  confirmIfNeeded(): void {
    if (!this.props.isConfirmed) {
      this.props.isConfirmed = true;
    }
  }

  update(name: string | null, email: string): void {
    if (name !== null) {
      this.props.name = name;
    }
    this.props.email = email;
  }
}
