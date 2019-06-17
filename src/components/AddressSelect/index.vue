<template>
  <div>
    <div style="display:flex;justify-content: space-between;">
      <el-select
        :value="provinceData.length ? value.province : ''"
        placeholder="请选择省份"
        :disabled="selectDisabled"
        @change="changeProvince"
      >
        <el-option
          v-for="item in provinceData"
          :key="item.id"
          :label="item.regionName"
          :value="item.regionCode"
        ></el-option>
      </el-select>
      <el-select
        :value="cityData.length ? value.city: ''"
        placeholder="请选择城市"
        :disabled="selectDisabled"
        @change="changeCity"
      >
        <el-option
          v-for="item in cityData"
          :key="item.id"
          :label="item.regionName"
          :value="item.regionCode"
        ></el-option>
      </el-select>
      <el-select
        :value="areaData.length ? value.area : ''"
        placeholder="请选择区域"
        :disabled="selectDisabled"
        @change="changeArea"
      >
        <el-option
          v-for="item in areaData"
          :key="item.id"
          :label="item.regionName"
          :value="item.regionCode"
        ></el-option>
      </el-select>
    </div>
    <el-input
      type="textarea"
      rows="2"
      :value="value.detail"
      @input="detailInput"
    ></el-input>
  </div>
</template>
<script>
import { getAddress, getLowerAddress } from "@/api/work_form_manage";
export default {
  name: "AddressSelect",
  data() {
    return {
      // 已选择的数据
      selectedAddr: {},
      provinceData: [], // 省份数据
      cityData: [], // 市数据
      areaData: [], // 区数据
      detail:''
    };
  },
  props: {
    // v-model
    value: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
    disabled: Boolean // 是否禁用
  },
  computed: {
    selectDisabled() {
      return this.disabled || false;
    }
  },
  methods: {
    // 选择省事件
    changeProvince(val) {
      this.selectedAddr.province = val;
      this.selectedAddr.city = "";
      this.selectedAddr.area = "";
      (this.cityData = []), // 市数据清除
        (this.areaData = []), // 区数据清除
        this.$emit("input", this.selectedAddr);
      this.$nextTick(() => {
        this.getCity();
      });
    },
    // 选择市事件
    changeCity(val) {
      this.selectedAddr.city = val;
      this.selectedAddr.area = "";
      this.$emit("input", this.selectedAddr);
      this.$nextTick(() => {
        this.getArea();
      });
    },
    // 选择区域
    changeArea(val) {
      this.selectedAddr.area = val;
      this.$emit("input", this.selectedAddr);
    },
    detailInput (val) {
      this.selectedAddr.detail = val;
      this.$emit("input", this.selectedAddr);
    },
    // 获取省份
    async getProvince() {
      let { data } = await getAddress(1);
      if (data.code === 0) {
        this.provinceData = data.data;
      } else {
        this.$message.error(data.message);
      }
    },
    // 获取市
    async getCity() {
      let { data } = await getLowerAddress(this.value.province);
      if (data.code === 0) {
        this.cityData = data.data;
      } else {
        this.$message.error(data.message);
      }
    },
    // 获取区
    async getArea() {
      let { data } = await getLowerAddress(this.value.city);
      if (data.code === 0) {
        this.areaData = data.data;
      } else {
        this.$message.error(data.message);
      }
    }
  },
  created() {
    this.selectedAddr = this.value;
    this.getProvince();
    if (this.value.province) {
      this.getCity();
    }
    if (this.value.city) {
      this.getArea();
    }
  }
};
</script>

