import { GenStatRecordListBuilder } from './gen-stat-record-list-builder';
import { GenStatRecord } from './gen-stat-record';

describe('GenStatRecordListBuilder.buildGenStatRecordList is a method', function () {
  let builder, rawData;
  beforeAll(function () {
    builder = new GenStatRecordListBuilder();
    rawData = require('../gen_stat_dump.BEN.20160831T0900-20160831T1000.json');
  });
  describe('that starts with input input validation.', function () {
    describe('It makes sure that input', function () {
      it('is an array', function () {
        expect(builder.buildGenStatRecordList).toThrowError(TypeError, 'rawData is not an array');
      });
      it('is an array of nonzero length', function () {
        expect(function () {
          builder.buildGenStatRecordList([]);
        }).toThrowError(TypeError, 'rawData array is missing header record');
      });
      it('first element is an array of filed names', function () {
        expect(function () {
          builder.buildGenStatRecordList([1]);
        }).toThrowError(TypeError);
        expect(function () {
          builder.buildGenStatRecordList([[]]);
        }).toThrowError(TypeError);
        expect(function () {
          builder.buildGenStatRecordList([['x']]);
        }).toThrowError(TypeError);

        const required_fields = ['client', 'app_server', 'report_type', 'asof_date', 'report',
          'port', 'user', 'host', 'flags', 'req_time', 'pid', 'req_no'];
        expect(function () {
          builder.buildGenStatRecordList([required_fields]);
        }).not.toThrowError(TypeError);
      });
    });
  });
  it('builds a vector of GenStatRecords', function () {
    const rawDataSlice = rawData.slice(0, 2);
    const loadedData = builder.buildGenStatRecordList(rawDataSlice);
    expect(Array.isArray(loadedData)).toBe(true);
    expect(loadedData.length).toBe(1);
  });
  it('ignores exception thrown by GenStatRecord constructor', function () {
    const rawDataSlice = rawData.slice(0, 2);
    rawDataSlice.push([]);
    const loadedData = builder.buildGenStatRecordList(rawDataSlice);
    expect(loadedData.length).toBe(1);
  });

  it('builds an array of GenStatRecords', () => {
    const x = [
      ['client', 'app_server', 'report_type', 'asof_date', 'report', 'port', 'user', 'host', 'flags',
        'req_time', 'pid', 'req_no'],
      ['DMO', 'VARServer', 'NLAF_RPT', 1472648422443, 'VOL_DIFF_LINK', 'HCS-ALL-E', 'navagarw', 'bendtsl001', '1',
        '12.0512475967407', '29148', '2004']
    ];
    const r:GenStatRecord = new GenStatRecord('DMO', 'VARServer', 'NLAF_RPT', 1472648422443, 'VOL_DIFF_LINK', 'HCS-ALL-E',
      'navagarw', 'bendtsl001', 1, 12.0512475967407, 29148, 2004);
    const y = builder.buildGenStatRecordList(x);
    expect(y).toEqual([r]);
  });
});
