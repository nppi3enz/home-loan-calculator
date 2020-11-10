<template>
  <v-col justify="center" align="center">
    <h1>โปรแกรมคำนวณสินเชื่อบ้าน สินเชื่อคอนโด</h1>
    <p>ใช้สำหรับคำนวณด้วยวิธีลดต้นลดดอกเพื่อเปรียบเทียบดอกเบี้ยแต่ละธนาคารโดยคร่าว ๆ เท่านั้น</p>
    <v-col
    no-gutters>
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-currency-field
            label="เงินต้น"
            v-model="startLoan"
            outlined/>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-text-field
            label="ระยะเวลา (เดือน)"
            v-model="month"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-currency-field
            label="ชำระต่อเดือน"
            v-model="payout"
            outlined/>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="startDate"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                label="วันที่เริ่มต้น"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>

      </v-row>

      <v-container
        class="px-0"
        fluid
      >
        <v-switch
          v-model="addonMode"
          :label="`ต้องการจ่ายโปะ`"
        >
        </v-switch>
        <v-row
          md="auto"
        >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              mdi-help-circle
            </v-icon>
          </template>
          <span>ระบบจะคำนวณชำระเงินเพิ่มจากเงินที่ชำระต่อเดือนเท่านั้น (กรณีจ่ายโปะวันเดียวกับที่ชำระ)</span>
        </v-tooltip>
        </v-row>
        <v-container v-if="addonMode">
          <v-col no-gutters>
            <v-row
              v-for="(item, index) in addons"
              :key="item.round"
            >
              <v-text-field
                label="งวดที่"
                v-model="item.round"
              ></v-text-field>
              <v-currency-field
                label="จ่ายเพิ่ม (บาท)"
                v-model="item.amount"
              />
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="primary"
                @click="deleteAddon(index)"
              >
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-row>
            <a @click="createAddon">[ เพิ่มแถวใหม่ ]</a>
          </v-col>
        </v-container>

      </v-container>

        <v-col>
          อัตราดอกเบี้ย/ปี
          <v-row v-for="(item, index) in interests" :key="index">
            <v-text-field
              label="งวดที่"
              v-model="item.start"
              v-on:keyup="changeInterest(index)"
            ></v-text-field>
            ถึง
            <v-text-field
              label="งวดที่"
              v-model="item.end"
              disabled
            ></v-text-field>
            <v-text-field
              label="อัตราดอกเบี้ย"
              v-model="item.loanInterest"
            ></v-text-field>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="primary"
              @click="deleteInterest(index)"
            >
              <v-icon dark>
                mdi-minus
              </v-icon>
            </v-btn>
          </v-row>
          <a @click="createInterest">[ เพิ่มแถวใหม่ ]</a>

          <v-container
          >
            <v-row
            >
              <v-col
                md="auto"
              >
                MRR =
              </v-col>
              <v-col>
                <v-text-field
                  @keypress="onlyForCurrency"
                  v-model="mrr"
                ></v-text-field>
              </v-col>
              <v-col
                md="auto"
              >
                %
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-help-circle
                    </v-icon>
                  </template>
                  <span>Minimum Retail Rate (MRR) คือ อัตราดอกเบี้ยเงินกู้ขั้นต่ำที่ธนาคารเรียกเก็บจากลูกค้ารายย่อยชั้นดี<br>ซึ่งแต่ละธนาคารจะมีค่า MRR ไม่เท่ากัน</span>
                </v-tooltip>
              </v-col>
              <v-col
                md="auto"
              >
                MLR =
              </v-col>
              <v-col>
                <v-text-field
                  @keypress="onlyForCurrency"
                  v-model="mlr"
                ></v-text-field>
              </v-col>
              <v-col
                md="auto"
              >
                %
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-help-circle
                    </v-icon>
                  </template>
                  <span>Minimum Loan Rate (MLR) คือ อัตราดอกเบี้ยเงินกู้ขั้นต่ำที่ธนาคารเรียกเก็บจากลูกค้ารายใหญ่ชั้นดีประเภทเงินกู้แบบกำหนดระยะเวลา<br>ซึ่งแต่ละธนาคารจะมีค่า MLR ไม่เท่ากัน</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>

          <v-btn
            color="error"
            @click="calculateBtn()"
            large
          >
            เริ่มคำนวณ
          </v-btn>
        </v-col>
    </v-col>
    <v-card
      class="mx-auto"
      max-width="400"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <div class="overline mb-4">
            ผลการคำนวณ
          </div>
          <v-list class="transparent">
            <v-list-item-title class="text-right">จำนวนงวด (เดือน)</v-list-item-title>
            <v-list-item-subtitle  class="text-right">
              <span class="text-h2">{{ tables.length-1 }}</span>
            </v-list-item-subtitle>
          </v-list>
          <v-list class="transparent">
            <v-list-item-title class="text-right">รวมค่างวด</v-list-item-title>
            <v-list-item-subtitle  class="text-right">
              <span class="text-h2">{{ numFormat(sumField('pay')) }}</span>
            </v-list-item-subtitle>
          </v-list>
          <v-list class="transparent">
            <v-list-item-title class="text-right">รวมเงินต้น</v-list-item-title>
            <v-list-item-subtitle  class="text-right">
              <span class="text-h2">{{ numFormat(sumField('payLoan')) }}</span>
            </v-list-item-subtitle>
          </v-list>
          <v-list class="transparent">
            <v-list-item-title class="text-right">รวมดอกเบี้ย</v-list-item-title>
            <v-list-item-subtitle  class="text-right">
              <span class="text-h2">{{ numFormat(sumField('payInterest')) }}</span>
            </v-list-item-subtitle>
          </v-list>
        </v-list-item-content>
      </v-list-item>

    </v-card>
    <line-chart :chart-data="datacollection" :options="barChartOptions" :height="200"></line-chart>
    <v-col>
      <v-data-table
          :headers="headers"
          :items="tables" item-key="id"
          :loading="checkLoading"
          loading-text="Loading... Please wait"
          hide-default-footer
          disable-pagination
          dense>
          <template v-slot:item="{ item }">
              <tr>
                  <td>{{ item.round }}</td>
                  <td>{{ dateFormat(item.date) }}</td>
                  <td>{{ item.day }}</td>
                  <td>{{ numFormat(item.interest) }}%</td>
                  <td>{{ numFormat(item.pay) }}</td>
                  <td>{{ numFormat(item.payLoan) }}</td>
                  <td>{{ numFormat(item.payInterest) }}</td>
                  <td>{{ numFormat(item.remain) }}</td>
              </tr>
          </template>
          <template slot="body.append">
              <tr class="pink--text">
                  <th class="title text-left" colspan="4">รวม</th>
                  <th class="title">{{ numFormat(sumField('pay')) }}</th>
                  <th class="title">{{ numFormat(sumField('payLoan')) }}</th>
                  <th class="title">{{ numFormat(sumField('payInterest')) }}</th>
                  <th class="title"></th>
              </tr>
          </template>
      </v-data-table>

    </v-col>
  </v-col>
</template>

<script>
import numeral from 'numeral'
import BarChart from '~/components/BarChart'
import LineChart from '~/components/LineChart'
import _ from 'lodash'

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

export default {
  components: {
    BarChart,
    LineChart
  },
  mounted () {
  },
  data: () => ({
    datacollection: null,
    modal: false,
    addonMode: false,
    checkLoading: false,
    startLoan: 1700000,
    payout: 30000,
    month: 360,
    mrr: 7.25,
    mlr: 0,
    startDate: new Date().toISOString().substr(0, 10),
    errors: {},
    interests: [
      {
        start: 1,
        end: 12,
        loanInterest: '1.25'
      },
      {
        start: 13,
        end: 24,
        loanInterest: '4.75'
      },
      {
        start: 25,
        end: 360,
        loanInterest: 'MRR-1.00'
      },
    ],
    addons: [
      {round: 10, amount: '100000'},
    ],
    headers: [
      // {
      //   text: "Dessert (100g serving)",
      //   align: "left",
      //   sortable: false,
      //   value: "name"
      // },
      { text: "งวดที่", value: "round" },
      { text: "วันที่", value: "date" },
      { text: "จำนวนวัน", value: "day" },
      { text: "ดอกเบี้ย", value: "interest" },
      { text: "ยอดชำระ", value: "pay" },
      { text: "ชำระเงินต้น", value: "payLoan" },
      { text: "ชำระเงินดอกเบี้ย", value: "payInterest" },
      { text: "ยอดคงเหลือ", value: "remain" },
    ],
    tables: [
      {}
      // {
      //   id: 0,
      //   round: 1,
      //   interest: 4.5,
      //   pay: 30000,
      //   payLoan: 1000,
      //   payInterest: 100,
      //   remain: 2000
      // },
    ],
      barChartOptions: {
        responsive: true,
        // legend: {
        //   display: false,
        // },
        title: {
          display: true,
          text: 'กราฟแสดงเงินต้นสะสม ดอกเบี้ยสะสม และเงินต้นคงเหลือ'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
  }),
  methods: {
    fillData() {
        let tableInterest = this.tables.map(({ payInterest }) => payInterest)
        // tableInterest.forEach((num, index) => {
        //     if(index != 0){
        //       tableInterest[index] = num + tableInterest[index-1]
        //     }
        // });
        let tableLoan = this.tables.map(({ payLoan }) => payLoan)
        // tableLoan.forEach((num, index) => {
        //     if(index != 0){
        //       tableLoan[index] = num + tableLoan[index-1]
        //     }
        // });

        this.datacollection = {
          labels: this.tables.map(({ round }) => round),
          datasets: [
            {
              type: 'line',
              label: 'ดอกเบี้ยสะสม',
              borderColor: chartColors.red,
              backgroundColor: chartColors.red,
              borderWidth: 2,
              fill: true,
              // backgroundColor: ["red", "orange", "yellow"],
              // backgroundColor: [chartColors.red, chartColors.orange, chartColors.yellow],
              data: tableInterest,
            },
            {
              type: 'line',
              label: 'เงินต้นคงเหลือ',
              borderColor: chartColors.orange,
              borderWidth: 2,
              fill: false,
              // backgroundColor: ["red", "orange", "yellow"],
              // backgroundColor: [chartColors.red, chartColors.orange, chartColors.yellow],
              data: this.tables.map(({ remain }) => remain),
            },
            {
              type: 'line',
              label: 'เงินต้นสะสม',
              borderColor: chartColors.blue,
              // backgroundColor: chartColors.blue,
              borderWidth: 2,
              fill: false,
              // backgroundColor: ["red", "orange", "yellow"],
              // backgroundColor: [chartColors.red, chartColors.orange, chartColors.yellow],
              data: tableLoan,
            }
          ]
        }
      return null
    },
    createAddon() {
      this.addons.push(
        {round: 0, amount: '0'}
      )
    },
    deleteAddon(id) {
      this.addons.splice(id, 1)
    },
    createInterest() {
      const last = this.interests[this.interests.length-1]
      this.interests.push(
        {
          start: last.end,
          end: this.month,
          loanInterest: '0'
        }
      )
    },
    deleteInterest(id) {
      this.interests.splice(id, 1)
    },
    changeInterest(key) {
      if(key != 0) {
        this.interests[key-1].end = this.interests[key].start - 1
      }
    },
    sumField(key) {
        return this.tables.reduce((a, b) =>  a + (numeral(b[key]).value() || 0), 0)
    },
    async calculateBtn() {
      this.checkLoading = true
      await this.calculate()
      this.checkLoading = false
    },
    calculate() {
      let startD = this.$dayjs(this.startDate, ["YYYY-MM-DD"]);
      let endD = this.$dayjs(this.startDate, ["YYYY-MM-DD"]);

      let total_remain = this.startLoan

      let table_temp = [{
        round: 0,
        date: endD,
        day: 0,
        interest: 0,
        pay: 0,
        payLoan:  0,
        payInterest: 0,
        remain: numeral(total_remain).format('0,0.00'),
      }]
      let i = 1

      while(total_remain >= 0) {
        startD = endD
        let currentMonth = endD.month()
        endD = endD.month(currentMonth+1)
        let day = endD.diff(startD, 'day')

        let percentInterest = this.getInterest(i)
        let calculatePayInterest = Math.round(( percentInterest * total_remain / 100 / 365 * day * 100) ) / 100
        let payout = this.payout

        if(this.addonMode) {
          for(let j=0;j<this.addons.length;j++) {
            if(this.addons[j].round == i){
              payout += numeral(this.addons[j].amount).value()
              break;
            }
          }
        }

        let calculatePayLoan = payout - calculatePayInterest
        // console.log(`month = ${i+1}`)
        // console.log(`interest = ${percentInterest}`)

        total_remain = total_remain - calculatePayLoan

        table_temp.push({
          round: i,
          date: endD,
          day: day,
          interest: percentInterest,
          pay: payout,
          payLoan: calculatePayLoan,
          payInterest: calculatePayInterest,
          remain: total_remain >= 0 ? total_remain : 0,
        })
        i++
      }
      this.tables = table_temp
      this.fillData()
    },
    getInterest(n) {
      for(let i=0;i<this.interests.length;i++) {
        if( this.interests[i].start >= n || n <= this.interests[i].end ){
          let rawInterest = this.interests[i].loanInterest
          rawInterest = rawInterest.toLowerCase();
          rawInterest = rawInterest.replace("mrr", this.mrr);
          rawInterest = rawInterest.replace("mlr", this.mlr);
          return parseFloat(eval(rawInterest))
        }
      }
      return -1
    },
    numFormat(n) {
      return numeral(n).format('0,0.00')
    },
    dateFormat(date){
      return this.$dayjs(date).locale('th').format('DD MMM YYYY')
    },
    onlyForCurrency ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
          $event.preventDefault();
      }
    }
  }

}
</script>
