import { Link } from "@/application/core/link.entity";
import { type LinkDTO, type LinkRow } from "@/application/dto/link.dto";

export class LinkMapper {
  static toDomain(row: LinkRow): Link {
    return Link.restore({
      id: row.id,
      tripId: row.tripId,
      title: row.title,
      url: row.url,
    });
  }

  static toPersistence(link: LinkRow) {
    return {
      id: link.id,
      tripId: link.tripId,
      title: link.title,
      url: link.url,
    };
  }

  static toDTO(link: LinkRow): LinkDTO {
    return {
      id: link.id,
      title: link.title,
      url: link.url,
    };
  }
}
