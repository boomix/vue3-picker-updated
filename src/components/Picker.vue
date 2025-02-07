<script setup lang="ts">
import { computed } from "vue";
import usePicker from "@/hooks/usePicker";
import type { PickerOptions, PickData } from "@/types";
import { isObject, isArray } from "@/utils/checkType";

interface Props {
  data?: PickData;
  isShowPicker: boolean;
  options?: Partial<PickerOptions>;
  anchor: number | Array<number>;
  showKey?: string | Array<string>;
  swipeTime?: number;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  isShowPicker: false,
  options: () => ({}),
  swipeTime: 500,
  type: "",
});

const emit = defineEmits(["update:isShowPicker", "update:anchor", "cancel", "confirm"]);

const options = computed(() => ({
  cancelClass: "",
  confirmClass: "",
  titleClass: "",
  cancelColor: "#999",
  confirmColor: "#42b983",
  titleColor: "",
  cancelText: "Cancel",
  confirmText: "Confirm",
  titleText: "",
  ...props.options,
}));
const cancelColor = computed(() => options.value.cancelColor);
const confirmColor = computed(() => options.value.confirmColor);
const titleColor = computed(() => options.value.titleColor);
const showKeys = computed(() =>
  isArray(props.showKey) ? props.showKey : [props.showKey]
);

function confirmItem(index2: any) {
  const { anchor } = getSelectedItem();
  if (index2 === anchor && allowedClick()) {
    confirm();
  }
}

const {
  pickerData,
  wheelWrapper,
  cancel,
  confirm,
  closePicker,
  allowedClick,
  getSelectedItem,
} = usePicker(props, emit);
</script>

<template>
  <transition name="fade">
    <div class="mask" v-show="isShowPicker" @click="closePicker"></div>
  </transition>

  <transition name="slide">
    <div class="picker" v-show="isShowPicker">
      <div class="picker_title">
        <button
          :class="['picker_cancel', options.cancelClass]"
          :style="{ color: cancelColor }"
          @click="cancel"
        >
          {{ options.cancelText }}
        </button>
        <button
          :class="['picker_confirm', options.confirmClass]"
          :style="{ color: confirmColor }"
          @click="confirm"
        >
          {{ options.confirmText }}
        </button>
        <h4 :class="[options.titleClass]" :style="{ color: titleColor }">
          {{ options.titleText }}
        </h4>
      </div>
      <div class="picker_panel">
        <div class="picker_mask_top"></div>
        <div class="picker_mask_bottom"></div>
        <div class="picker_wheel_wrapper" ref="wheelWrapper">
          <div
            class="picker_wheel"
            v-for="(wheel, wheelIndex) in pickerData"
            :key="wheelIndex"
          >
            <ul class="picker_wheel_scroll">
              <li
                class="picker_wheel_item"
                v-for="(item, index) in wheel"
                :key="index"
                @touchend="confirmItem(index)"
              >
                {{ showKeys?.[wheelIndex] && isObject(item) ? item[showKeys[wheelIndex]!] : item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active,
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0.5;
  transform: translate3d(0, 270px, 0);
}

.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.2);
}

.picker {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 310px;
  z-index: 10000;
  background: #fff;

  &_title {
    position: relative;
    height: 44px;
    color: #333;

    &::after {
      content: "";
      display: block;
      border-bottom: 1px solid #ebebeb;
      left: 0;
      right: 0;
      transform: scaleY(0.5);
    }

    button {
      position: absolute;
      height: 44px;
      line-height: 44px;
      padding: 0 12px;
      font-size: 14px;
      border: none;
      background-color: transparent;
    }

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: normal;
      height: 44px;
      line-height: 44px;
      text-align: center;
    }
  }

  &_cancel {
    left: 0;
  }

  &_confirm {
    right: 0;
  }

  &_panel {
    position: relative;
    height: 266px;
    padding: 24px 12px;
    box-sizing: border-box;
  }

  &_mask_top,
  &_mask_bottom {
    position: absolute;
    left: 0;
    right: 0;
    height: 95px;
    background: #fff;
    transform: translateZ(0);
    z-index: 1;
    pointer-events: none;
  }

  &_mask_top {
    top: 20px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.5)
    );

    &:after {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #ebebeb;
      transform: scaleY(0.5);
    }
  }

  &_mask_bottom {
    bottom: 24px;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.5)
    );

    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      border-bottom: 1px solid #ebebeb;
      transform: scaleY(0.5);
    }
  }

  &_wheel {
    flex: 1;
    overflow: hidden;

    &_wrapper {
      display: flex;
      align-items: stretch;
      height: 100%;
    }

    &_scroll {
      margin-top: 92px;
      padding: 0;
    }

    &_item {
      height: 30px;
      line-height: 30px;
      font-size: 17px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }
  }
}
</style>
