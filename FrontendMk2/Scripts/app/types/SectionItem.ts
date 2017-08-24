/** "Class" for SectionItems; used for Scenario sections and copied from the C# class of the same name. */
import { ActionItem } from "./ActionItem";
export interface SectionItem {
	Title: string;
	FileLocation: string;
	ContentAsHtml: string;
	Actions: Array<ActionItem>;
}