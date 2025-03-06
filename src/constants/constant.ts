export const PAYMENT_TYPE = {
  QPay: 'QPay',
  QPay2: 'QPay2',
  MonPay: 'MonPay',
  SocialPay: 'SocialPay',
  Toki: 'Toki',
  Cash: 'Cash',
  Kart: 'Card',
  Upoint: 'Upoint',
  UPT: 'UPT', //Upoint
  CTE: 'CTE',
  MNQ: 'MNQ',
  UNP: 'UNP',
  GLP: 'GLP',
  MCD: 'MCD',
  MBK: 'MBK',
};

export enum NotificationActionType {
  P = 'P', // Primary
  S = 'S', // Secondary
  L = 'L', // Link
}

export enum NotificationType {
  WARNING = 'WARNING',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const CARD_PAYMENTS = [PAYMENT_TYPE.CTE, PAYMENT_TYPE.MCD];

export const QPAY_BANK_TYPE = {
  KHAAN_BANK: 'Khan bank',
  BOGD_BANK: 'Bogd bank',
  CAPITRON_BANK: 'Capitron bank',
  CHINGIG_KHAAN_BANK: 'Chinggis khaan bank',
  MOST_MONEY: 'Most money',
  NATIONAL_INVESTMENT_BANK: 'National investment bank',
  STATE_BANK: 'State bank',
  TRADE_AND_DEVELOPMENT_BANK: 'Trade and Development bank',
  KHAS_BANK: 'Xac bank',
};

export const DRAFT_TYPE = {
  DRAFT: 'DRAFT',
  NEW: 'NEW', //Хүлээгдэж байна
  ACCEPTED: 'ACCEPTED', //Хүлээн авсан
  COOKING: 'COOKING', //Хоол хийгдэж байна
  READY: 'READY', //Хоол бэлэн болсон
  COMPLETED: 'COMPLETED', //Хоол хүлээн авсан
  CANCELLED: 'CANCELLED', //Хоол цуцалсан
  RETURN: 'RETURN', //Хоол буцаасан
  PROCESSING: 'PROCESSING',
  PREPARING: 'PREPARING',
  PREPARED: 'PREPARED',
  DELIVERING: 'DELIVERING',
  PICKEDUP: 'PICKEDUP',
  MOVED: 'MOVED',
};

export const TYPE = {
  DINIG: 'Dining',
  PRE_ORDER: 'PreOrder',
  TAKE_AWAY: 'TakeAway',
  DELIVERY: 'Delivery',
  MOVE: 'Moved',
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const YEAR_FORMAT = 'YYYY';
export const PATTERN_CODE = '[0-9]{1}'; // Pattern for four digits

export enum MenuItemState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SOLD_OUT = 'SOLD_OUT',
}

export enum DayOfWeek {
  Sunday = 'sun',
  Monday = 'mon',
  Tuesday = 'tue',
  Wednesday = 'wed',
  Thursday = 'thu',
  Friday = 'fri',
  Saturday = 'sat',
}

export const kioskConfigs = [
  {
    name: 'noPrint',
    value: 'NO_PRINT',
  },
];

export const SOUND_LINK = 'https://s3.ap-southeast-1.amazonaws.com/images.monarty.mn/typing.mp3';

export const validPrefixes = [
  'А',
  'Б',
  'В',
  'Г',
  'Д',
  'Е',
  'Ё',
  'Ж',
  'З',
  'И',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'О',
  'Ө',
  'Р',
  'С',
  'Т',
  'У',
  'Ү',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Ъ',
  'Ы',
  'Ь',
  'Э',
  'Ю',
  'Я',
];
export enum ChannelType {
  P = 'P', //Point of Sale
  Q = 'Q', //QR Menu
  W = 'W', //Web
  K = 'K', //Kiosk
  T = 'T', //Toki
  F = 'F', //Facebook
  G = 'G', //Google
  C = 'C', //FB Chat
  M = 'M', //Monpay
  I = 'I', //API
  U = 'U', //UbEats
  MB = 'MB', //MBank
  MR = 'MR', //Marketplace
  QM = 'QM', //Qmenu
}

export const polygonCoords = [
  { lat: 47.91354623996547, lng: 106.9998069501953 },
  { lat: 47.92551070544776, lng: 106.99740369091796 },
  { lat: 47.928271343009264, lng: 106.9661613203125 },
  { lat: 47.927696222335044, lng: 106.94933850537109 },
  { lat: 47.93459724833985, lng: 106.93835217724609 },
  { lat: 47.94034937478837, lng: 106.92238766918945 },
  { lat: 47.94943331044595, lng: 106.91723782788085 },
  { lat: 47.950468087897185, lng: 106.91019971142578 },
  { lat: 47.9405793675394, lng: 106.8950935102539 },
  { lat: 47.93451635981258, lng: 106.89325321550248 },
  { lat: 47.93290620026289, lng: 106.88741672868608 },
  { lat: 47.92865053724108, lng: 106.86510074968217 },
  { lat: 47.92473961921403, lng: 106.85102451677201 },
  { lat: 47.919793034678264, lng: 106.84862125749467 },
  { lat: 47.918872687694055, lng: 106.82939518327592 },
  { lat: 47.942681397070025, lng: 106.81806553239701 },
  { lat: 47.940036526203116, lng: 106.80467594499467 },
  { lat: 47.90851765594315, lng: 106.78218830461381 },
  { lat: 47.85956075252602, lng: 106.74991596574662 },
  { lat: 47.83897789683187, lng: 106.78890667805234 },
  { lat: 47.836420334232145, lng: 106.82937584766904 },
  { lat: 47.83742721584303, lng: 106.8764110649542 },
  { lat: 47.84134473110495, lng: 106.93580590137998 },
  { lat: 47.882806157553965, lng: 106.95468865284482 },
];

export const pp = [
  { lat: 5293699.717, lng: 681943.436 },
  { lat: 5293719.463, lng: 681940.259 },
  { lat: 5293723.717, lng: 681964.893 },
  { lat: 5293703.369, lng: 681968.166 },
];

export const polygonCoordsA = [
  { lat: 47.86480581301623, lng: 106.78986661281574 },
  { lat: 47.85858655309223, lng: 106.7932998403548 },
  { lat: 47.86273280927721, lng: 106.82660214748371 },
  { lat: 47.85116315017686, lng: 106.81917466398919 },
  { lat: 47.840160872356485, lng: 106.82732857939446 },
  { lat: 47.84327170062274, lng: 106.83900155302727 },
  { lat: 47.85191191148565, lng: 106.85599602934563 },
  { lat: 47.8658334647881, lng: 106.84973038908684 },
  { lat: 47.870494203104286, lng: 106.86968020185756 },
  { lat: 47.8761363406451, lng: 106.87491587385463 },
  { lat: 47.88338961481561, lng: 106.86693361982631 },
  { lat: 47.88431059284136, lng: 106.87603167280483 },
  { lat: 47.8774028585164, lng: 106.87946490034389 },
  { lat: 47.879014745577535, lng: 106.8867605088644 },
  { lat: 47.8841379107088, lng: 106.88633135542202 },
  { lat: 47.883850105875304, lng: 106.89534357771205 },
  { lat: 47.87797853822358, lng: 106.89311197981166 },
  { lat: 47.862584438551636, lng: 106.89476422056484 },
  { lat: 47.86140393766513, lng: 106.91090038999843 },
  { lat: 47.862346563487314, lng: 106.92628554090786 },
  { lat: 47.875989324069735, lng: 106.92998698934841 },
  { lat: 47.883576689802354, lng: 106.94162777647304 },
  { lat: 47.904286329759884, lng: 106.95603490573866 },
  { lat: 47.904910072650615, lng: 106.9640413928927 },
  { lat: 47.90718276271584, lng: 106.96425596961389 },
  { lat: 47.9084485215101, lng: 106.9735685993136 },
  { lat: 47.91509324732167, lng: 106.97266737708459 },
  { lat: 47.91272224639742, lng: 106.9743348616859 },
  { lat: 47.91407416108525, lng: 106.97871222679821 },
  { lat: 47.917295602656246, lng: 106.97630896752086 },
  { lat: 47.924226774501996, lng: 106.97613730614391 },
  { lat: 47.925081984568216, lng: 106.96633114998546 },
  { lat: 47.92502446924213, lng: 106.94950833504406 },
  { lat: 47.928245229015566, lng: 106.94195523445812 },
  { lat: 47.930258102028915, lng: 106.93586125557628 },
  { lat: 47.93301848619704, lng: 106.93380131905285 },
  { lat: 47.939113812596254, lng: 106.91998257820812 },
  { lat: 47.9394588095842, lng: 106.90659299080578 },
  { lat: 47.93943548993626, lng: 106.89798429982307 },
  { lat: 47.933853991299245, lng: 106.89724401013495 },
  { lat: 47.930403543815856, lng: 106.8999905921662 },
  { lat: 47.928994544894955, lng: 106.89260915295722 },
  { lat: 47.929893106900124, lng: 106.89023808018806 },
  { lat: 47.92896917668161, lng: 106.87698796765449 },
  { lat: 47.92617981933926, lng: 106.86587289349677 },
  { lat: 47.92479946315941, lng: 106.86278298871161 },
  { lat: 47.9221784329462, lng: 106.85255284012372 },
  { lat: 47.91746169907562, lng: 106.85036415756757 },
  { lat: 47.91760550829306, lng: 106.83989281357343 },
  { lat: 47.91749046095109, lng: 106.83298344315106 },
  { lat: 47.9172603654997, lng: 106.8312239140373 },
  { lat: 47.915707194437424, lng: 106.82882065475995 },
  { lat: 47.92922411031108, lng: 106.81764595111557 },
  { lat: 47.928994067046766, lng: 106.80859081348129 },
  { lat: 47.923760306346246, lng: 106.80665962299057 },
  { lat: 47.91884238928617, lng: 106.81000701984115 },
  { lat: 47.91157966450383, lng: 106.80113954985187 },
  { lat: 47.91002632292154, lng: 106.80143995726154 },
  { lat: 47.907270927348954, lng: 106.8025893989986 },
  { lat: 47.909963743812305, lng: 106.85391615070759 },
  { lat: 47.89940104254612, lng: 106.85341563768928 },
  { lat: 47.884840402985546, lng: 106.86045375414436 },
  { lat: 47.880652684406215, lng: 106.84062686510627 },
  { lat: 47.87655036399018, lng: 106.82221618242805 },
  { lat: 47.873441531891274, lng: 106.79818358965461 },
];
