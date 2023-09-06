declare const _default: (isDate: any) => {
    selectYear?: undefined;
    selectMonth?: undefined;
    dateList?: undefined;
    updateDateSelect?: undefined;
    getDateAnchors?: undefined;
} | {
    selectYear: import("vue").Ref<number>;
    selectMonth: import("vue").Ref<number>;
    dateList: import("vue").ComputedRef<any[][]>;
    updateDateSelect: (pickerAnchors: any) => void;
    getDateAnchors: (anchor: any) => any;
};
export default _default;
