import { TextMessageEnum, TextMessageType } from "../types/text-message-type";

export const SampleTextMessageTypeData: TextMessageType[] = [
  {
    typeId: "4e9a3f0b-2c8d-4f7a-9b1c-5d6e7f8a9b0c",
    messageType: TextMessageEnum.NOTICE,
  },
  {
    typeId: "d3e5f7a9-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
    messageType: TextMessageEnum.AFTER_DUE_DATE,
  },
];
