/** "Class" for Scenarios; used for Scenarios and copied from the C# class of the same name. */
import { Section } from "./Section";
export interface Scenario {
	StepsFolderLocalizedPath: string;
	ActionsFolderLocalizedPath: string;
	CaseStudiesLocalizedPath: string;
	PartnersLocalizedPath: string;
	BusinessSection: Section;
	TechnicalSection: Section;
	DisplayName: string;
	Description: string;
	EmailMessage: string;
}