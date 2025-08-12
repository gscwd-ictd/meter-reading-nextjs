import { IAreaRepository } from "./interfaces/area/area.interface.repository";
import { IBillingAdjustmentRepository } from "./interfaces/billing-adjustments/billing-adjustment.interface.repository";
import { IConsumerRepository } from "./interfaces/consumer/consumer.interface.repository";
import { IMeterReaderRepository } from "./interfaces/meter-readers/meter-readers.interface.repository";
import { IScheduleRepository } from "./interfaces/schedule/schedule.interface.repository";
import { IZoneBookRepository } from "./interfaces/zone-book/zone-book.interface.repository";
import { AreaRepository } from "./services/area/area.repository";
import { AreaService } from "./services/area/area.service";
import { BillingAdjustmentRepository } from "./services/billing-adjustments/billing-adjustment.repository";
import { BillingAdjustmentService } from "./services/billing-adjustments/billing-adjustment.service";
import { ConsumerRepository } from "./services/consumer/consumer.repository";
import { ConsumerService } from "./services/consumer/consumer.service";
import { MeterReaderRepository } from "./services/meter-readers/meter-readers.repository";
import { MeterReaderService } from "./services/meter-readers/meter-readers.service";
import { ScheduleRepository } from "./services/schedule/schedule.repository";
import { ScheduleService } from "./services/schedule/schedule.service";
import { ZoneBookRepository } from "./services/zone-book/zone-book.repository";
import { ZoneBookService } from "./services/zone-book/zone-book.service";

export class MeterReadingContext {
  private static instance: MeterReadingContext;

  // Repositories
  private _meterReaderRepository?: IMeterReaderRepository;
  private _areaRepository?: IAreaRepository;
  private _zoneBookRepository?: IZoneBookRepository;
  private _scheduleRepository?: IScheduleRepository;
  private _consumerRepository?: IConsumerRepository;
  private _billingAdjustmentRepository?: IBillingAdjustmentRepository;

  // Services
  private _meterReaderService?: MeterReaderService;
  private _areaService?: AreaService;
  private _zoneBookService?: ZoneBookService;
  private _scheduleService?: ScheduleService;
  private _consumerService?: ConsumerService;
  private _billingAdjustmentService?: BillingAdjustmentService;

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

  public getScheduleRepository(): IScheduleRepository {
    if (!this._scheduleRepository) {
      this._scheduleRepository = new ScheduleRepository();
    }
    return this._scheduleRepository;
  }

  public getConsumerRepository(): IConsumerRepository {
    if (!this._consumerRepository) {
      this._consumerRepository = new ConsumerRepository();
    }

    return this._consumerRepository;
  }

  public getBillingAdjustmentRepository(): IBillingAdjustmentRepository {
    if (!this._billingAdjustmentRepository) {
      this._billingAdjustmentRepository = new BillingAdjustmentRepository();
    }

    return this._billingAdjustmentRepository;
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

  public getScheduleService(): ScheduleService {
    if (!this._scheduleService) {
      this._scheduleService = new ScheduleService(this.getScheduleRepository());
    }
    return this._scheduleService;
  }

  public getConsumerService(): ConsumerService {
    if (!this._consumerService) {
      this._consumerService = new ConsumerService(this.getConsumerRepository());
    }
    return this._consumerService;
  }

  public getBillingAdjustmentService(): BillingAdjustmentService {
    if (!this._billingAdjustmentService) {
      this._billingAdjustmentService = new BillingAdjustmentService(this.getBillingAdjustmentRepository());
    }

    return this._billingAdjustmentService;
  }
}

// Export singleton instance
export const meterReadingContext = MeterReadingContext.getInstance();
