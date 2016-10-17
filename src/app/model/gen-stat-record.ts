export class GenStatRecord {
  constructor(private _client: string, private _appServer: string, private _reportType: string,
              private _asofDate: number, private _report: string,
              private _port: string, private _user: string, private _host: string,
              private _flags: number, private _reqTime: number, private _pid: number,
              private _reqNo: number) {
    if ( arguments.length < 12 ) {
      throw new TypeError('GenStatRecord constructor: insufficient number ' +
        'of arguments passed to GenStatRecord constructor');
    }
    // TODO: make sure that asof_date is a valid epoch
    // TODO: make sure that flags is a positive integer
    // TODO: make sure that req_time is a positive number
    // TODO: make sure that pid is a positive integer
    // TODO: make sure that req_no a positive integer
    if (_client == null ) {
      throw new TypeError('GenStatRecord constructor: client is null');
    }
    if ( _appServer == null ) {
      throw new TypeError('GenStatRecord constructor: appServer is null');
    }
    if ( _reportType == null ) {
      throw new TypeError('GenStatRecord constructor: reportType is null');
    }
    if ( _asofDate == null ) {
      throw new TypeError('GenStatRecord constructor: asofDate is null');
    }
    if ( _host == null ) {
      throw new TypeError('GenStatRecord constructor: host is null');
    }
    if ( _reqTime == null ) {
      throw new TypeError('GenStatRecord constructor: reqTime is null');
    }
    if ( _pid == null ) {
      throw new TypeError('GenStatRecord constructor: pid is null');
    }
    if ( _reqNo == null ) {
      throw new TypeError('GenStatRecord constructor: reqNo is null');
    }
    // these parameters have reasonble defaults
    if ( _report == null ) {
      _report = '';
    }
    if ( _port == null ) {
      _port = '';
    }
    if ( _user == null ) {
      _user = '';
    }
    if ( _flags == null ) {
      _flags = 0;
    }
  }

  get client(): string {
    return this._client;
  }
  get appServer(): string {
    return this._appServer;
  }
  get reportType(): string {
    return this._reportType;
  }
  get asofDate(): number {
    return this._asofDate;
  }
  get report(): string {
    return this._report;
  }
  get port(): string {
    return this._port;
  }
  get user(): string {
    return this._user;
  }
  get host(): string {
    return this._host;
  }
  get flags(): number {
    return this._flags;
  }
  get reqTime(): number{
    return this._reqTime;
  }
  get pid(): number {
    return this._pid;
  }
  get reqNo(): number {
    return this._reqNo;
  }
}
