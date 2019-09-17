import { User } from './users/shared/user';

export class AppSettings {
    static title = 'BikeCounter';
    static version = '0.0.1';
    static translate = {
        languages: ['cs', 'en'],
        defaultLanguage: 'cs'
    };

    static userToken = '';
    static user = 'user';
    static defaultSnackBarDuration = 2000;
    static pageSize = 10;
    static pageSizeOptions = [5, 10, 15, 20];
    static desktopSize = 960;
    static defaultDialogWidth = '500px';
    static bikecounters = 'bikecounters';
    static refreshInterval = 300000;
    static refreshBikecounters = false;
    static mapTimeout = 1000;
    static weatherAPIKey = '7b3da2e3530fe03fa263dc982400dc63';
    static dateFormat = 'DD-MM-YYYY HH:mm';
    static dateFormatWithSec = 'DD-MM-YYYY HH:mm:ss';
    static dbToken = '';
    static device = 'web';
    static serverKey = 'AAAAySdRMF8:APA91bHM9dgQYHEwpTilTnlIQKkZ4ocoAVRw8LkioGeepiTZc7rLIiY30Z-jj_-ybQa_qH6s9sHLlug1xL1wZ5d98-kdSPWTPcaA-ykAnvJ3U0_8juFN-3ou8mT_tyNaxmZPWD7Y0C2w';
    static activeBikecounters = [
        'BC_KJ-HRHO',
        'BC_PN-VYBR',
        'BC_PN-VYBR2',
        'BC_RN-JK',
        'BC_ST-RABA',
        'BC_TL-TRHO',
        'BC_VR-ST',
        'BC_SU-KRKA',
        'BC_PT-ZOVO',
        'BC_HZ-CE',
        'BC_DS-KJVL',
        'BC_VK-HRUP',
        'BC_VF-ARUE',
        'BC_VK-MOKO',
        'BC_CB-CHTU',
        'BC_NS-PAVL',
        'BC_PP-ROJP',
        'BC_KO-LEPR',
        'BC_JG-PNPC',
        'BC_VS-CE',
        'BC_SH-SEKU',
        'BC_BS-BMZL',
        'BC_KR-RAZB',
        'BC_NM-CEKV',
        'BC_CT-OTPB',
        'BC_PM-MHJA',
        'BC_EU-KTOT'
    ];


    static isDesktop(): boolean {
        return (window.innerWidth > this.desktopSize);
    }


}
