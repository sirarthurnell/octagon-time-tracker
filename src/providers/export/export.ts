import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { from } from 'rxjs/observable/from';
import { merge } from 'rxjs/observable/merge';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as xlsx from 'xlsx';

/**
 * Exports data.
 */
@Injectable()
export class ExportProvider {
  private readonly EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private readonly EXCEL_EXTENSION = '.xlsx';

  constructor(private emailComposer: EmailComposer) {}

  /**
   * Sends the specified data through email.
   * @param fileName Name of the generated file.
   * @param json Data.
   */
  sendExcelThroughEmail(fileName: string, json: any[]): Observable<boolean> {
    const checkAvailable$ = from<boolean>(
      this.emailComposer.isAvailable()
    ).pipe(map(available => !!available));

    const notAvailable$ = checkAvailable$.pipe(filter(available => !available));
    const toBase64Factory = bindCallback(this.toBase64Stream);
    const available$ = checkAvailable$.pipe(
      filter(available => available),
      switchMap(() => toBase64Factory(this.createExcelDocumentBlob(json))),
      tap((file64: string) => this.composeEmail(fileName, file64)),
      map(_ => true)
    );

    const conditional$ = merge(available$, notAvailable$);
    return conditional$;
  }

  /**
   * Composes the email.
   * @param fileContentAs64 File to attach.
   */
  private composeEmail(fileName: string, fileContentAs64: string): void {
    let email = {
      attachments: [
        `base64:${fileName}.${this.EXCEL_EXTENSION}//${fileContentAs64}`
      ],
      subject: 'Checkings exported',
      body: `Checkings exported (${new Date().toLocaleString()})`,
      isHtml: true
    };

    this.emailComposer.open(email);
  }

  /**
   * Exports the specified data to an Excel file.
   * @param fileName Name of the generated file.
   * @param json Data.
   */
  exportToExcelFile(fileName: string, json: any[]): void {
    const excelBlob = this.createExcelDocumentBlob(json);

    FileSaver.saveAs(excelBlob, fileName + this.EXCEL_EXTENSION);
  }

  /**
   * Converts a blob to a base64 stream.
   * @param blob Blob to convert.
   * @param cb Callback with the blob converted to base64.
   */
  private toBase64Stream(blob: Blob, cb: (base64: string) => void): void {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result as string);
    reader.readAsDataURL(blob);
  }

  /**
   * Creates a binary blob with an Excel
   * file in it.
   * @param json Data.
   */
  private createExcelDocumentBlob(json: any[]): Blob {
    const sheet = xlsx.utils.json_to_sheet(json);
    const workbook: xlsx.WorkBook = {
      Sheets: { data: sheet },
      SheetNames: ['data']
    };
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: this.EXCEL_TYPE });

    return blob;
  }
}
