import {Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {ChartObject, PointObject} from 'highcharts';


@Component({
  selector: 'app-root',
  template: `
        Selection: {{selection}}<br>
        <button (click)="selectionTitle='Report'; selectionValue='NF_CA_PFC';">Report NF_CA_PFC</button>
        <button (click)="selectionTitle='Report'; selectionValue='xyz';">Report xyz</button>
        <button (click)="selectionTitle='User'; selectionValue='abc';">User abc</button>
        <summary-chart [data]="data" [title]="'Report'" [type]="'Time'"
          [selectionTitle]="selectionTitle" [selectionValue]="selectionValue"
          (onSummarySelected)="onSummarySelected($event)">
        </summary-chart>
    `
})
export class ChartsExample {
  private data: [string, number][] = [
    ["NF_CA_PFC", 7169.4515073001385],
    ["TE_MKTDECOMP3", 5714.61398764141],
    ["praada_ts_fctr_", 4276.555221661924],
    ["NF_PFC_SUMMARY", 3919.3624784201384],
    ["dispatch", 3641.579503090121],
    ["TS_ex_ante_risk", 2409.208191577345],
    ["PRT_S2F_CHG", 1165.2306106686592],
    ["PRT_SUMMARY_no_", 1152.1771657187492],
    ["mk_ts_factor_le", 953.5140337944031],
    ["VARServer_cache", 907.0988602638245],
    ["APB_Risk_Master", 871.2978379726411],
    ["PRT_PBA_DIFF", 866.439026258886],
    ["apb_sec_scen_ex", 812.9024147391317],
    ["PRISM_SEC_MASTE", 794.5513434708117],
    ["mai_risk_rpt", 696.5432643592358],
    ["EPNL_FRESID", 694.0383300781241],
    ["MAP_alloc_mc", 637.4647654145956],
    ["null", 603.1389842102654],
    ["risk_chg_decomp", 549.6348693072795],
    ["risk", 527.9538660179825],
    ["mps_betas", 513.8043737336993],
    ["dng_crowdedness", 500.29011535644497],
    ["tstnl_factor_ta", 450.9470117329621],
    ["cb_ts_pnl", 380.0277001559735],
    ["PRT_SUMMARY_MAS", 377.3919932786372],
    ["eq_ts", 371.76525469869375],
    ["maps_msaar_sec", 301.3358497619629],
    ["FOLIO_F2A", 286.7030074596404],
    ["atx_pcs_norm_be", 284.6378916501998],
    ["atx_pcs_risk", 238.54039192199704],
    ["storm_betas", 224.59881758689883],
    ["MAP_blkops", 213.027221679688],
    ["MTX_BTCR", 209.6939616203308],
    ["atx_vol_diff", 204.27170944213873],
    ["pnl", 190.05348783731472],
    ["MAP_strat_info", 170.61416800320146],
    ["NF_PFC_EXPAND_A", 161.7453798055649],
    ["PBA_DIFF_PNL_UN", 142.48149600625038],
    ["PRISM_PG_MASTER", 135.89629423618328],
    ["PRT_PG_PNL", 124.29950356483465],
    ["EDR2", 120.42237424850465],
    ["FACTOR_PIECE", 96.83048641681671],
    ["PRT_DIV_TS_REG", 95.45171558856966],
    ["IMPACT", 88.2246055603028],
    ["PRT_PBA_DIFF_BL", 84.5561835467816],
    ["GPLive_factor_i", 73.96728301048277],
    ["ts_risk", 73.37328720092779],
    ["rates", 71.07787200435997],
    ["atx_pcs_sec_rco", 70.58173847943544],
    ["IRIS", 68.64650130271914],
    ["MAP_port_info", 67.97676795581356],
    ["SEC_PBA", 66.1719970703125],
    ["atx_pcs_pg_n_be", 60.66272926330561],
    ["MAP_snapshot_eq", 57.38649272918701],
    ["SHORTD_stress_L", 51.0366592407227],
    ["mat", 47.94545713067053],
    ["MADR_BETA", 39.42422062158583],
    ["tstnl_dgs_ts", 37.02881836891173],
    ["liq_snapshot", 34.1157608032227],
    ["PRT_DRSTORM", 33.2596702575684],
    ["STRESS_PBA", 23.441771984100342],
    ["MAP_load_breakd", 22.070151992142204],
    ["FOLIO", 21.9880533218384],
    ["TE", 20.516164096072327],
    ["MAP_snapshot", 19.847844869829707],
    ["MAP_expand", 19.3827896118164],
    ["MAP_sector_list", 17.133551135659182],
    ["PRT_TS_CONTRIB", 13.12784910202025],
    ["EXPAND_PBA", 11.669084906578059],
    ["prt_ts_contrib", 11.3030529022217],
    ["PRT_TE", 10.808068871498108],
    ["apb_covar_mtx", 8.32876807451249],
    ["PRT_PG_RISK", 8.29147815704345],
    ["MAP_lookup_fact", 8.223469026386741],
    ["ATX_PnL_TS", 7.75484895706177],
    ["rqa_block_beta", 6.973306953907015],
    ["ts_factor_vols", 5.00601291656494],
    ["MAP_get_fx_rate", 4.3032639399170876],
    ["PRISM_VOL_DIF_M", 4.074716031551361],
    ["scen_descriptio", 4.0463550090789795],
    ["MAP_lookup_port", 3.857666917145257],
    ["ts_fctr_exp", 3.8153759241104126],
    ["SEC", 3.1784040927887],
    ["FLEX_VOL_DIFF_L", 2.95160400867462],
    ["scen_meta_data_", 2.916770994663239],
    ["ms_pba_main", 2.90684390068054],
    ["MAP_load_factor", 2.811252936720846],
    ["MAP_lookup_what", 2.436148999258873],
    ["PRISM_FACTOR_MA", 2.42288899421691],
    ["eq_rqalon_w_bet", 2.3565069437027],
    ["GPLive_lr", 1.09573698043823],
    ["corr_mtx", 1.06368505954742],
    ["mk_expand_port", 1.04989302158356],
    ["/d0/prod1/repor", 0.626423001289368],
    ["master_ts_lvl_n", 0.575766980648041],
    ["ts_factor_level", 0.516601011157035],
    ["NLAF_EPNL_FRESI", 0.5052819997072218],
    ["NF_PFC_VOL_DIFF", 0.43953400850296],
    ["mrob_mvf_fctr_r", 0.423179000616074],
    ["MAP_schema_info", 0.2274720035493373],
    ["pfc_var_factor_", 0.0943600013852119],
    ["MAP_lookup_long", 0.0788339972496033]
  ];
  private selection = 'None';
  private selectionTitle = '';
  private selectionValue = '';

  private onSummarySelected(info: [string,string]) {
    this.selection = `${info[0]} ${info[1]}`;
    this.selectionTitle = info[0];
    this.selectionValue = info[1];
  }
}

@Component({
  selector: 'summary-chart',
  template: `
        <chart [options]="options" (load)="saveInstance($event.context)">
          <series>
            <point (click)="onPointClick($event)"></point>
          </series>
        </chart>
    `
})
export class SummaryChartComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() type: string;
  @Input() data: [string, number][];
  @Input() selectionTitle: string;
  @Input() selectionValue: string;
  @Output() onSummarySelected = new EventEmitter<[string, string]>();

  private options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false
    },
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      series: {
        animation: false,
        stacking: 'normal',
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          inside: true,
          crop: false,
          overflow: 'none',
          format: '{point.name}',
          style: ''
        }
      }
    },
    series: []
  };
  private chart: ChartObject;
  private seriesOptions: any = {data: [], dataLabels: {align: 'left'}};
  private seriesOptions2: any = {data: [], dataLabels: {align: 'right'}};

  constructor() {
  }

  ngOnInit() {
    const cutoff = 5;
    const total = this.data.reduce((a, b)=>a + b[1], 0);
    this.seriesOptions.data = this.data.slice(0, cutoff).map(e=> {
      return {name: e[0], y: e[1], color: 'lightblue'};
    });
    this.seriesOptions2.data = this.data.slice(0, cutoff).map(e=> {
      const name = Math.round(e[1]).toLocaleString() + ' sec';
      const y = total - e[1];
      return {name: name, y: y, color: 'whitesmoke'};
    });
    if (this.data.length > cutoff) {
      const otherY = this.data.slice(cutoff).reduce((a, b)=>a + b[1], 0);
      this.seriesOptions.data.push({name: 'Other', y: otherY, color: 'lightgrey'});
      const name2 = Math.round(otherY).toLocaleString() + ' sec';
      const otherY2 = total - otherY;
      this.seriesOptions2.data.push({name: name2, y: otherY2, color: 'whitesmoke'});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chart) {
      return;
    }
    if (!changes['selectionValue']) {
      return;
    }
    const newTitle = changes['selectionTitle'] ? changes['selectionTitle'].currentValue : this.title;
    const newValue = newTitle === this.title ? changes['selectionValue'].currentValue : null;
    const points:PointObject[] = (<any>this.chart.series[1]).points;
    const pt = points.find(p=>p.name === newValue);
    this.select(pt);
  }

  private saveInstance(chartInstance) {
    this.chart = chartInstance;
    this.chart.addSeries(this.seriesOptions2, false);
    this.chart.addSeries(this.seriesOptions, false);
    this.chart.setTitle({text: `${this.title} ${this.type}`}, false);
    this.chart.redraw();
  }

  private select(pt: PointObject): void {
    const points:PointObject[] = (<any>this.chart.series[1]).points;
    const pt2 = points.find(p => (<any>p).color === 'lightgreen');
    if (pt2 === pt) {
      return;
    }
    if (pt2) {
      pt2.update({color: 'lightblue'}, false);
    }
    if ( pt ) {
      pt.update({color: 'lightgreen'}, false);
    }
    this.chart.redraw(false);
  }

  private onPointClick(e) {
    const pt = e.context.series.chart.series[1].points[e.context.index];
    if (pt.name === 'Other' && pt.index === pt.series.points.length - 1) {
      return;
    }
    this.select(pt);
    this.onSummarySelected.emit([this.title, pt.name]);
  }
}

