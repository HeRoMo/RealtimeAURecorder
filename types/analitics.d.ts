declare namespace AdvancedGoogleServices {
  export interface Analytics {
    Data: {
      Realtime: {
        get(a: string, b: string): RealtimeData;
      }
    }
  }
}

interface RealtimeData {
  kind: 'analytics#realtimeData';
  id: string;
  query: {
    ids: string,
    dimensions: string,
    metrics: string[],
    sort: string[],
    filters: string,
    "max-results": number
  },
  totalResults: number;
  selfLink: string;
  profileInfo: {
    profileId: string,
    accountId: string,
    webPropertyId: string,
    internalWebPropertyId: string,
    profileName: string,
    tableId: string
  };
  columnHeaders: [
    {
      name: string,
      columnType: string,
      dataType: string
    }
  ];
  totalsForAllResults: { [key: string]: any };
  rows: string[][];
}

declare var Analytics: AdvancedGoogleServices.Analytics;
