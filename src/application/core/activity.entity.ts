interface ActivityProps {
  title: string;
  occursAt: Date;
  tripId: string;
}

export class Activity {
  private constructor(
    public readonly id: string,
    private props: ActivityProps,
  ) {}

  static restore(props: ActivityProps & { id: string }): Activity {
    return new Activity(props.id, props);
  }

  static create(id: string, props: ActivityProps): Activity {
    return new Activity(id, props);
  }

  get title(): string {
    return this.props.title;
  }

  get occursAt(): Date {
    return this.props.occursAt;
  }

  get tripId(): string {
    return this.props.tripId;
  }

  update(props: Partial<ActivityProps>): void {
    this.props = {
      ...this.props,
      ...props,
    };
  }
}
