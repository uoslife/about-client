export class NotionUtil {
  public static extractName = (property: any): string => {
    if (
      property.type !== "title" ||
      property.title.length === 0 ||
      !property.title[0].plain_text
    ) {
      console.error("Property does not have a name");
    }
    return property.title[0].plain_text;
  };

  public static extractGithub = (property: any): string | null => {
    if (property.type === "url") {
      return property.url;
    }
    return null;
  };

  public static extractLinkedin = (property: any): string | null => {
    if (property.type === "url") {
      return property.url;
    }
    return null;
  };
}
