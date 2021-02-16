import { SurveyModel } from "survey-knockout";
import { CreatorBase } from "../../creator-base";
import { SurveyTextWorker } from "../../textWorker";

export interface IJsonEditorModel {
  isJSONChanged: boolean;
  text: string;
  onEditorActivated(): void;
  processErrors(text: string): void;
  readOnly: boolean;
}

export abstract class JsonEditorBaseModel implements IJsonEditorModel {
  public isJSONChanged: boolean = false;
  public isProcessingImmediately: boolean = false;
  private static updateTextTimeout: number = 1000;
  private jsonEditorChangedTimeoutId: number = -1;

  constructor(protected creator: CreatorBase<SurveyModel>) {}

  public abstract text: string;
  public abstract onEditorActivated(): void;
  protected onTextChanged(): void {
    if (this.jsonEditorChangedTimeoutId !== -1) {
      clearTimeout(this.jsonEditorChangedTimeoutId);
    }
    if (this.isProcessingImmediately) {
      this.jsonEditorChangedTimeoutId = -1;
    } else {
      const self: JsonEditorBaseModel = this;
      this.jsonEditorChangedTimeoutId = window.setTimeout(() => {
        self.jsonEditorChangedTimeoutId = -1;
        self.processErrors(self.text);
      }, JsonEditorBaseModel.updateTextTimeout);
    }
  }
  protected abstract setErrors(errors: any[]): void;
  public processErrors(text: string): void {
    const textWorker: SurveyTextWorker = new SurveyTextWorker(text);
    this.setErrors(textWorker.errors);
  }
  public get readOnly(): boolean {
    return this.creator.readOnly;
  }
}