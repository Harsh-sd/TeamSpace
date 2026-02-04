//As we are using hooks and we want to takes params as well so that can't be possible together so we make seperate files
import TeamClient from "./TeamClient";

export  default async function TeamPage({ params }) {
 const { teamId } = await params; 

  return <TeamClient teamId={teamId} />;
}
