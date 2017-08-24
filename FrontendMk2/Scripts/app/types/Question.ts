/** "Class" for Questions; used in the landing page/SiteConfig and copied from the C# class of the same name. */
export interface Question {
	Text: string;
	Required: boolean;
	QuestionId: string;
	Options: string[];
}