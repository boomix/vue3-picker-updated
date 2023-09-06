declare const _sfc_main: import("vue").DefineComponent<{
    data: {
        type: ArrayConstructor;
        required: false;
        default: () => never[];
    };
    isShowPicker: {
        type: BooleanConstructor;
        required: true;
        default: boolean;
    };
    options: {
        type: ObjectConstructor;
        required: false;
        default: () => {};
    };
    anchor: {
        type: (ArrayConstructor | NumberConstructor)[];
        required: true;
    };
    showKey: {
        type: (ArrayConstructor | StringConstructor)[];
        required: false;
    };
    swipeTime: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    type: {
        type: StringConstructor;
        required: false;
        default: string;
    };
}, {
    props: any;
    emit: (event: "update:isShowPicker" | "update:anchor" | "cancel" | "confirm", ...args: any[]) => void;
    options: import("vue").ComputedRef<any>;
    cancelColor: import("vue").ComputedRef<any>;
    confirmColor: import("vue").ComputedRef<any>;
    titleColor: import("vue").ComputedRef<any>;
    showKeys: import("vue").ComputedRef<any>;
    confirmItem: (index2: any) => void;
    pickerData: import("vue").Ref<never[]>;
    wheelWrapper: import("vue").Ref<any>;
    cancel: () => void;
    confirm: () => void;
    closePicker: () => void;
    allowedClick: () => boolean;
    getSelectedItem: () => {
        item: never[];
        anchor: never[];
    };
    readonly isObject: (value: any) => boolean;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:isShowPicker" | "update:anchor" | "cancel" | "confirm")[], "update:isShowPicker" | "update:anchor" | "cancel" | "confirm", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    data: {
        type: ArrayConstructor;
        required: false;
        default: () => never[];
    };
    isShowPicker: {
        type: BooleanConstructor;
        required: true;
        default: boolean;
    };
    options: {
        type: ObjectConstructor;
        required: false;
        default: () => {};
    };
    anchor: {
        type: (ArrayConstructor | NumberConstructor)[];
        required: true;
    };
    showKey: {
        type: (ArrayConstructor | StringConstructor)[];
        required: false;
    };
    swipeTime: {
        type: NumberConstructor;
        required: false;
        default: number;
    };
    type: {
        type: StringConstructor;
        required: false;
        default: string;
    };
}>> & {
    "onUpdate:isShowPicker"?: ((...args: any[]) => any) | undefined;
    "onUpdate:anchor"?: ((...args: any[]) => any) | undefined;
    onCancel?: ((...args: any[]) => any) | undefined;
    onConfirm?: ((...args: any[]) => any) | undefined;
}, {
    data: unknown[];
    options: Record<string, any>;
    swipeTime: number;
    type: string;
}, {}>;
export default _sfc_main;
