import { IPersonnelRepository } from "./interfaces/personnel/personnel.interface.repository";
import { PersonnelRepository } from "./services/personnel/personnel.repository";
import { PersonnelService } from "./services/personnel/personnel.service";

export class MeterReadingContext {
  private static instance: MeterReadingContext;

  private readonly personnelService: PersonnelService;
  private readonly personnelRepository: IPersonnelRepository;

  private constructor() {
    this.personnelRepository = new PersonnelRepository();
    this.personnelService = new PersonnelService(this.personnelRepository);
  }

  public static getInstance(): MeterReadingContext {
    if (!this.instance) {
      this.instance = new MeterReadingContext();
    }
    return this.instance;
  }

  public getPersonnelRepository(): IPersonnelRepository {
    return this.personnelRepository;
  }

  public getPersonnelService(): PersonnelService {
    return this.personnelService;
  }
}

export const meterReadingContext = MeterReadingContext.getInstance();
