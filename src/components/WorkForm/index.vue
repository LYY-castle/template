<template>
  <div class="container">
    <div class="template">
      <div style="font-size:18px;font-weight:800" v-if="!showOrEdite">工单模板</div>
      <div>
        <el-input v-model="value.name" class="title"></el-input>
      </div>
      <div
        class="selectShow"
        v-for="(item, index) in value.workformPropertyCreateInfos"
        :key="index"
      >
        <div class="demo">
          <div class="name" :class="item.isRequired?'star':''">{{ item.name }}</div>
          <div class="name">
            <p class="white-space:normal;width:100%;">{{ item.val }}</p>
          </div>
          <div v-if="item.dataType === 'input'">
            <el-input
              type="text"
              size="small"
              :disabled="showOrEdite"
              style="inputWidth"
              :placeholder="item.placeholder"
              v-model="item.defaultValue"
              :maxlength="item.maxValue"
              :minlength="item.minValue"
            ></el-input>
          </div>
          <div v-if="item.dataType === 'textarea'">
            <el-input
              size="small"
              type="textarea"
              :rows="2"
              :disabled="showOrEdite"
              style="inputWidth"
              :placeholder="item.placeholder"
              v-model="item.defaultValue"
              :maxlength="item.maxValue"
              :minlength="item.minValue"
            ></el-input>
          </div>
          <div v-if="item.dataType === 'inputNumber'">
            <el-input
              size="small"
              type="number"
              :disabled="showOrEdite"
              :placeholder="item.placeholder"
              v-model="item.defaultValue"
              :maxlength="item.maxValue"
              :minlength="item.minValue"
            ></el-input>
          </div>
          <div v-if="item.dataType === 'radio'">
            <el-radio-group v-model="item.defaultValue">
              <el-radio
                :label="item1.value"
                :disabled="showOrEdite"
                v-for="(item1,index1) in item.dataValues"
                :key="index1"
              ></el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.dataType === 'checkbox'">
            <el-checkbox-group v-model="item.defaultValue">
              <el-checkbox
                v-for="(item2,index2) in item.dataValues"
                :key="index2"
                :label="item2.value"
                :disabled="showOrEdite"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="item.dataType === 'select'|| item.dataType === 'multipleSelect'">
            <el-select
              :placeholder="item.placeholder"
              v-model="item.defaultValue"
              :disabled="showOrEdite"
              :multiple="item.dataType==='multipleSelect'?true:false"
            >
              <el-option v-for="i in item.dataValues" :key="i.value" :value="i.value"></el-option>
            </el-select>
          </div>
          <div
            v-if="item.dataType === 'datetime'||item.dataType === 'date'||item.dataType === 'time'"
          >
            <el-date-picker
              :type="item.dataType"
              :placeholder="item.placeholder"
              :disabled="showOrEdite"
              v-model="item.defaultValue"
            ></el-date-picker>
          </div>
          <div v-if="item.dataType==='span'">
            <div v-html="item.defaultValue"></div>
          </div>
          <div v-if="item.dataType === 'address'">
            <AddressSelect v-model="item.defaultValue"></AddressSelect>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAddress, getLowerAddress } from "@/api/work_form_manage";
import AddressSelect from "@/components/AddressSelect";
export default {
  name: "WorkForm",
  data() {
    return {
      showOrEdite: false,
    };
  },
  created() {
  },
  props: {
    value: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  components: {
    AddressSelect
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.colmn {
  display: flex;
  justify-content: space-around;
  height: 100%;
}
.table-container {
  .form-container {
    box-shadow: none;
    border: 1px solid #ebeef5;
    border-left: solid 4px #57afff;
  }
}
.leftside {
  min-width: 150px;
  padding-left: 0;
}
.leftside .el-menu-item {
  padding: 0 10px;
  padding-left: 0;
  i {
    font-size: 20px;
  }
}
.inputWidth {
  width: 55%;
}
.inputWidth1 {
  width: 46%;
}
.showaddTool {
  float: right;
  margin: 0px 65%;
  height: 20px;
  cursor: pointer;
}

.tools {
  display: flex;
  justify-content: flex-end;
  i {
    margin: 0 10px;
    font-size: 18px;
    cursor: pointer;
    display: none;
  }
}
.template {
  padding: 10px 0;
  height: 600px;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  .title {
    padding: 10px;
    /deep/ .el-input__inner {
      border: none;
      text-align: center;
      font-size: 16px;
      color: #000;
      font-weight: 800;
    }
    &:hover {
      border: 1px dashed #eee;
      background-color: rgba(87, 175, 255, 0.1);
      cursor: pointer;
    }
  }
}
.selectShow {
  &:hover {
    cursor: pointer;
    border: 1px dashed #eee;
    background-color: rgba(87, 175, 255, 0.1);
    i {
      display: block;
      font-size: 16px;
    }
  }
  &.active {
    cursor: pointer;
    border: 1px dashed #eee;
    background-color: rgba(87, 175, 255, 0.1);
    i {
      display: block;
      font-size: 16px;
    }
  }

  .demo {
    padding: 10px;
    .name {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
.setting {
  padding-top: 10px;
  background-color: #fff;
  height: 600px;
  margin-left: 15px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  & > div {
    margin-bottom: 10px;
    span {
      font-size: 12px;
      color: #96999e;
      display: inline-block;
      margin: 15px 0 5px 0;
    }
    p {
      font-size: 14px;
      display: inline-block;
      margin: 15px 0 5px 0;
    }
  }
  .singchange {
    .tool {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .addDemoTools {
      display: none;
    }
    .addDemo:hover {
      .addDemoTools {
        display: block;
      }
    }
  }
}
.el-radio,
.el-radio + .el-radio {
  margin: 0 20px 0 0;
}
.el-checkbox {
  margin-bottom: 10px;
  margin-right: 20px;
}
.el-input {
  margin: 5px 0;
}
.el-menu-item {
  height: 40px;
  line-height: 40px;
}
.el-select {
  margin: 5px 0;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.star {
  padding-left: 10px;
  display: block;
  position: relative;
  &::before {
    content: "*";
    width: 5px;
    height: 5px;
    color: red;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-50%);
  }
}
.classA {
  color: red;
}
</style>


