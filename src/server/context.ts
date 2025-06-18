import { IAreaRepository } from "./interfaces/area/area.interface.repository";
import { IMeterReaderRepository } from "./interfaces/meter-readers/meter-readers.interface.repository";
import { IZoneBookRepository } from "./interfaces/zone-book/zone-book.interface.repository";
import { AreaRepository } from "./services/area/area.repository";
import { AreaService } from "./services/area/area.service";
import { MeterReaderRepository } from "./services/meter-readers/meter-readers.repository";
import { MeterReaderService } from "./services/meter-readers/meter-readers.service";
import { ZoneBookRepository } from "./services/zone-book/zone-book.repository";
import { ZoneBookService } from "./services/zone-book/zone-book.service";

export class MeterReadingContext {
  private static instance: MeterReadingContext;

  // Repositories
  private _meterReaderRepository?: IMeterReaderRepository;
  private _areaRepository?: IAreaRepository;
  private _zoneBookRepository?: IZoneBookRepository;

  // Services
  private _meterReaderService?: MeterReaderService;
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
  public getMeterReaderRepository(): IMeterReaderRepository {
    if (!this._meterReaderRepository) {
      this._meterReaderRepository = new MeterReaderRepository();
    }
    return this._meterReaderRepository;
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
  public getMeterReaderService(): MeterReaderService {
    if (!this._meterReaderService) {
      this._meterReaderService = new MeterReaderService(this.getMeterReaderRepository());
    }
    return this._meterReaderService;
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
