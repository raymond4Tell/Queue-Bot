import { Question } from "./Question";
import { ExternalLink } from "./ExternalLink";

/** "Class" for SiteConfig; copied from the C# class of the same name. */
export interface SiteConfig {
	Questions: Array<Question>;
	CaseStudies: Array<ExternalLink>;
	ScenarioMap: Object;
}