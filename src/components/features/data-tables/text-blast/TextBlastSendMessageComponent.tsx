import { Textarea } from "@mr/components/ui/Textarea";
import { Heading } from "../../typography/Heading";
import { Button } from "@mr/components/ui/Button";

export default function TextBlastSendMessageComponent() {
  return (
    <>
      <div className="">
        <Heading variant={"h4"} className="text-blue-700">
          Message
        </Heading>
      </div>
      <div className="flex flex-col gap-2 p-4 ">
        <Textarea
          rows={3}
          defaultValue="Hi DOE, JOHN account # 062320-0. Your current bill of 211.19 will due on 05/14/25, disc date
                  on 05/19/25. Kindly settle your bill before the due date to avoid disconnection. ACCOUNTS
                  WITH ARREARS WILL NOT BE ACCEPTED AT PAYMENT CENTERS. Thank you."
        />
        <div className="flex justify-end">
          <Button variant={"default"} className="w-fit">
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
