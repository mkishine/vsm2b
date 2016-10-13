import { GenStatRecord } from './gen-stat-record';

export class GenStatRecordListBuilder {
  buildGenStatRecordList(rawData:any):GenStatRecord[] {
    // rawData is an array
    if (!Array.isArray(rawData)) {
      throw new TypeError('rawData is not an array');
    }
    const rawDataArray = <any[]>rawData;
    // first row is header
    if (rawData.length < 1) {
      throw new TypeError('rawData array is missing header record');
    }
    const header = <string[]>rawDataArray[0];

    function fieldIndex(field):number {
      const index = header.indexOf(field);
      if (index === -1) {
        throw new TypeError('missing "' + field + '" field in header');
      }
      return index;
    }

    const clientIndex = fieldIndex('client');
    const appServerIndex = fieldIndex('app_server');
    const reportTypeIndex = fieldIndex('report_type');
    const asofDateIndex = fieldIndex('asof_date');
    const reportIndex = fieldIndex('report');
    const portIndex = fieldIndex('port');
    const userIndex = fieldIndex('user');
    const hostIndex = fieldIndex('host');
    const flagsIndex = fieldIndex('flags');
    const reqTimeIndex = fieldIndex('req_time');
    const pidIndex = fieldIndex('pid');
    const reqNoIndex = fieldIndex('req_no');
    let records:GenStatRecord[] = [];
    for (let i = 1; i < rawData.length; ++i) {
      const rawRecord = rawData[i];
      const client = rawRecord[clientIndex];
      const appServer = rawRecord[appServerIndex];
      const reportType = rawRecord[reportTypeIndex];
      const asofDate = +rawRecord[asofDateIndex];
      const report = rawRecord[reportIndex];
      const port = rawRecord[portIndex];
      const user = rawRecord[userIndex];
      const host = rawRecord[hostIndex];
      const flags = +rawRecord[flagsIndex];
      const reqTime = +rawRecord[reqTimeIndex];
      const pid = +rawRecord[pidIndex];
      const reqNo = +rawRecord[reqNoIndex];
      try {
        const gsr = new GenStatRecord(client, appServer, reportType, asofDate,
          report, port, user, host, flags, reqTime, pid, reqNo);
        records.push(gsr);
      } catch (e) {
        // do nothing
      }
    }
    return records;
  }
}
