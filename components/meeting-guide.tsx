import { meetingCopy, meetingLanguage, meetingSessions } from "@/lib/meeting-guide"
import { MeetingScenario } from "./meeting-scenario"

export function MeetingGuide({ lang }: { lang: string }) {
  return <MeetingScenario sessions={meetingSessions(lang)} text={meetingCopy[meetingLanguage(lang)]} />
}
