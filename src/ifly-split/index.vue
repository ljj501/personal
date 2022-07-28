<template>
  <div>
    <div
      id="ShiJuanHtmlContainer"
      v-html="html"
      @mousedown="beginSelectAsShiTi($event)"
      @mouseup="selectAsShiTi($event)"
    ></div>
    <div
      v-show="showConfirm"
      :style="{ left: confirmObj.left + 'px', top: confirmObj.top + 'px' }"
      class="confirmMenu"
    >
      <div class="content">
        <div style="text-align: left; margin-bottom: 10px">将选择试题题型</div>
        <select
          v-model="markTixingmingcheng"
          filterable
          clearable
          allow-create
          default-first-option
          @change="addMarkTixing2list()"
          size="small"
          placeholder="请选择题型"
        >
          <option
            v-for="item in tixinglist"
            :key="item"
            :label="item"
            :value="item"
          ></option>
        </select>
      </div>
      <div class="btns">
        <button size="mini" type="primary" @click="confirmMarkShiTi()">
          确定
        </button>
        <button size="mini" @click="cancelMarkShiTi()">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from './lib/jquery';
// import {elSelect} from 'element-ui';
import Vue from 'vue';
// Vue.use(elSelect)
export default {
  name: 'ifly-split',
  data() {
    return {
      splitHtml: '',
      mouseObj: {
        canNext: true,
        tmpDom: '',
      },
      selectRange: null, //选择的范围内容
      showConfirm: false,
      shitilist: [],
      tempCutKey: '',
      showSearch: false,
      confirmObj: { top: 0, left: 0 },
      markTixingmingcheng: '',
    };
  },
  props: {
    html: {
      type: String,
      default: '',
    },
    tixinglist: {
      type: Array,
      default: () => [],
    },
  },

  mounted() {
    console.log(333, $.fn.jquery, Vue);
    this.init();
  },
  methods: {
    init() {
      this.shitilist = new Array();
      let $container = $('#ShiJuanHtmlContainer');
      let shitiArray = $container.find('.Block_ShiTi');
      for (let i = 0; i < shitiArray.length; i++) {
        let $shiti = $(shitiArray[i]);
        let tixingmingcheng = $shiti.attr('tixingmingcheng') || '';
        let shitiObj = {
          tihao: i,
          tihaotablelabel: '第' + (i + 1) + '题',
          tihaolabel:
            '第' +
            (i + 1) +
            '题' +
            (tixingmingcheng.length > 0 ? '（' + tixingmingcheng + '）' : ''),
          html: $shiti.html(),
          isCur: false,
          tixingmingcheng: tixingmingcheng,
          daanStatus: false,
          realTihao: $shiti.attr('real-tihao'),
        };
        // 防止重复id 导致页面无法编辑
        if (this.shijuanState != 'edit') {
          $shiti.attr('id', 'SHITI_' + shitiObj.tihao);
        } else {
          if (!$shiti.attr('id')) $shiti.attr('id', 'SHITI_' + shitiObj.tihao);
        }
        $shiti.attr('tihao', shitiObj.tihao);
        $shiti.attr('title', shitiObj.tihaolabel);
        let tihao = '';
        if ($shiti.attr('real-tihao')) {
          tihao = `/ 题号${$shiti.attr('real-tihao')}`;
        } else {
          tihao = ' / 未匹配到题号';
        }
        $shiti.append(
          '<div class="shitilabel">' + shitiObj.tihaolabel + tihao + '</div>'
        );
        $shiti.append(
          '<div class="shititools"><span class="icon-close"></span> 取消划分</div>'
        );
        this.shitilist.push(shitiObj);
        let _this = this;
        $shiti.on('click', function () {
          _this.scrollShiTi(shitiObj, null, null);
          _this.scrollRight(shitiObj.tihao);
        });
        $shiti.find('.shititools').click(function (event) {
          //阻止冒泡
          event.stopPropagation();
          _this.removeShiTi(shitiObj, false);
          // 标记是否修改自动划题状态
          _this.autoHuaTi = false;
        });
      }
    },
    beginSelectAsShiTi(event) {
      let _this = this;
      this.cancelMarkShiTi();
      this.showConfirm = false;
      let e = event || window.event;
      this.selectRange = {
        x: e.screenX,
        y: e.screenY,
      };
      // 重复划题
      $('#ShiJuanHtmlContainer').on(
        'mouseenter',
        '.Block_ShiTi ',
        function (evt) {
          _this.mouseObj.canNext = false;
          _this.mouseObj.tmpDom = $(evt.target).attr('id');
          return;
        }
      );
      $('#ShiJuanHtmlContainer').on(
        'mouseleave',
        '.Block_ShiTi ',
        function (evt) {
          if (_this.mouseObj.tmpDom === $(evt.target).attr('id')) {
            _this.mouseObj.canNext = true;
          }
          return;
        }
      );
    },
    selectAsShiTi(event) {
      $('#ShiJuanHtmlContainer').off('mouseenter');
      $('#ShiJuanHtmlContainer').off('mouseleave');
      // 划题选中
      if (this.shijuanState == 'edit') {
        //如果当前正在编辑,取消选择划题
        return;
      }
      event = event || window.event;
      if (!this.selectRange) {
        return;
      }
      if (
        event.screenX == this.selectRange.x &&
        event.screenY == this.selectRange.y
      ) {
        this.selectRange = null;
        return; //没有选到内容,直接返回
      }
      this.selectRange = null;
      let selectionObj = window.getSelection();
      if (selectionObj == null) {
        return;
      }

      if (!this.mouseObj.canNext) {
        this.$message.warning('请勿重复划题...');
        let selection = window.getSelection();
        // 清空selection对象
        selection.removeAllRanges();
        this.mouseObj.canNext = true;
        return;
      }
      let rangeObj = null;
      try {
        rangeObj = selectionObj.getRangeAt(0);
      } catch (e) {
        return;
      }
      let selectContents = rangeObj.cloneContents();
      if (selectContents == null || selectContents.childNodes.length <= 0) {
        return;
      } else {
        this.tempCutKey = 'Temp_Cut' + new Date().getTime();
        this.currentSelectRange = rangeObj;
        // 不需要选题
        if (this.isSeach) {
          this.showSearch = true;
        } else {
          //显示确认框
          this.showConfirm = true;
        }
        this.confirmObj.left = event.pageX;
        this.confirmObj.top = event.pageY;
      }
    },
    cancelMarkShiTi() {
      if (this.isSeach) {
        this.showSearch = false;
      } else {
        this.showConfirm = false;
      }
      if (this.tempCutKey != null && this.tempCutKey.length > 0) {
        let selectionObj = window.getSelection();
        if (selectionObj != null) {
          selectionObj.removeAllRanges();
          selectionObj = null;
        }
        //清除临时剪切板内容
        let $tempBlock = $('#' + this.tempCutKey);
        $tempBlock.removeClass('Block_Temp');
        $tempBlock.removeAttr('id');
        this.tempCutKey = null;
      }
    },
  },
};
</script>

<style lang="less">
#ShiJuanHtmlContainer {
  max-height: 700px;
  overflow-y: auto;
}
.confirmMenu {
  position: fixed;
  z-index: 9999;
  padding: 10px;
  text-align: center;
  width: 200px;
  height: 120px;
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06),
    0px 2px 12px 0px rgba(0, 0, 0, 0.09), 0px 12px 24px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
}

.confirmMenu .content {
  flex-grow: 1;
  align-self: center;
  padding-top: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}

.confirmMenu .btns {
  flex-shrink: 0;
}
.Block_ShiTi {
  background: #f5f8ff;
  padding: 40px 10px 10px 10px;
  user-select: none;
  position: relative;
  cursor: pointer;
  border: 1px solid white;

  &:hover {
    border: 1px solid #b3d5ff;

    .shititools {
      display: block;
    }
  }
}

.Block_ShiTi:not(:last-child) {
  margin-bottom: 15px;
}

.Block_ShiTi.cur {
  border: 1px solid #9dc6f9;
  background: #e5eeff;
  .shitilabel {
    background: #6087cf;
  }
}

.Block_Temp {
  display: inline-block;
  background-color: #3390ff;
  color: white;
}

.shitilabel {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
  background: #ced9f5;
  padding: 1px 8px;
  color: white;
  border-radius: 0 0 3px 0;
}

.shititools {
  position: absolute;
  right: 6px;
  top: 6px;
  font-size: 14px;
  display: none;
  padding: 1px 2px;
  border-radius: 0 0 0 3px;
  color: #6087cf !important;
}
</style>