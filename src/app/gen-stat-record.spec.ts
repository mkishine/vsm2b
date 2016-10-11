import { GenStatRecord } from './gen-stat-record';

describe('GenStatRecord', function(){
  let client = 'client',
    appServer = 'appServer',
    reportType = 'reportType',
    asofDate = 0,
    report = 'report',
    port = 'port',
    user = 'user',
    host = 'host',
    flags = 0,
    reqTime = 0,
    pid = 0,
    reqNo = 0;
  describe('constructor', function(){
    it('checks number of arguments', function(){
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        port, user, host, flags, reqTime, pid, reqNo); }).not.toThrowError(TypeError);
    });
    it('validates arguments', function(){
      // client, appServer, reportType, asofDate, host, reqTime pid, and reqNo must be defined
      expect(function() { new GenStatRecord(null, appServer, reportType, asofDate, report,
        port, user, host, flags, reqTime, pid, reqNo); }).toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, null, reportType, asofDate, report,
        port, user, host, flags, reqTime, pid, reqNo); }).toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, null, asofDate, report,
        port, user, host, flags, reqTime, pid, reqNo); }).toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, null, report,
        port, user, null, flags, reqTime, pid, reqNo); }).toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        port, user, host, flags, null, pid, reqNo); }).toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        port, user, host, flags, reqTime, null, reqNo); }).toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        port, user, host, flags, reqTime, pid, null); }).toThrowError(TypeError);
      // report, port, user, and flags do not have to be defined
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, null,
        port, user, host, flags, reqTime, pid, reqNo); }).not.toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        null, user, host, flags, reqTime, pid, reqNo); }).not.toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        port, null, host, flags, reqTime, pid, reqNo); }).not.toThrowError(TypeError);
      expect(function() { new GenStatRecord(client, appServer, reportType, asofDate, report,
        port, user, host, null, reqTime, pid, reqNo); }).not.toThrowError(TypeError);

    });
  });
});
