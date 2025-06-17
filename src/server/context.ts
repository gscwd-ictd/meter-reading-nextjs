import { IAreaRepository } from "./interfaces/area/area.interface.repository";
import { IPersonnelRepository } from "./interfaces/personnel/personnel.interface.repository";
import { IZoneBookRepository } from "./interfaces/zone-book/zone-book.interface.repository";
import { AreaRepository } from "./services/area/area.repository";
import { AreaService } from "./services/area/area.service";
import { PersonnelRepository } from "./services/personnel/personnel.repository";
import { PersonnelService } from "./services/personnel/personnel.service";
import { ZoneBookRepository } from "./services/zone-book/zone-book.repository";
import { ZoneBookService } from "./services/zone-book/zone-book.service";

export class MeterReadingContext {
  private static instance: MeterReadingContext;

  // Repositories
  private _personnelRepository?: IPersonnelRepository;
  private _areaRepository?: IAreaRepository;
  private _zoneBookRepository?: IZoneBookRepository;

  // Services
  private _personnelService?: PersonnelService;
  private _areaService?: AreaService;
  private _zoneBookService?: ZoneBookService;

  private constructor() {}

  public static getInstance(): MeterReadingContext {
    if (!this.instance) {
      this.instance = new MeterReadingContext();
    }
    return this.instance;
  }

  // Repositories
  public getPersonnelRepository(): IPersonnelRepository {
    if (!this._personnelRepository) {
      this._personnelRepository = new PersonnelRepository();
    }
    return this._personnelRepository;
  }

  public getAreaRepository(): IAreaRepository {
    if (!this._areaRepository) {
      this._areaRepository = new AreaRepository();
    }
    return this._areaRepository;
  }

  public getZoneBookRepository(): IZoneBookRepository {
    if (!this._zoneBookRepository) {
      this._zoneBookRepository = new ZoneBookRepository();
    }
    return this._zoneBookRepository;
  }

  // Services
  public getPersonnelService(): PersonnelService {
    if (!this._personnelService) {
      this._personnelService = new PersonnelService(this.getPersonnelRepository());
    }
    return this._personnelService;
  }

  public getAreaService(): AreaService {
    if (!this._areaService) {
      this._areaService = new AreaService(this.getAreaRepository());
    }
    return this._areaService;
  }

  public getZoneBookService(): ZoneBookService {
    if (!this._zoneBookService) {
      this._zoneBookService = new ZoneBookService(this.getZoneBookRepository());
    }
    return this._zoneBookService;
  }
}

// Export singleton instance
export const meterReadingContext = MeterReadingContext.getInstance();
