<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  data: () => ({
    trackTimeout: null
  }),
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    // let ctx = canvas.getContext("2d");

    // /*** Gradient ***/
    // let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    // gradient.addColorStop(0, "rgba(250,174,50,1)");
    // gradient.addColorStop(1, "rgba(250,174,50,0)");

    setTimeout(() => {
      if (this.chartData.datasets) {
        let canvas = document.querySelector(".yearly-chart canvas");
        this.chartData.datasets.forEach(d => {
          // d.fillColor = gradient; // this.createGradient(d.baseColor, canvas.getContext("2d"));
          d.backgroundColor = this.createGradient(
            d.baseColor,
            canvas.getContext("2d")
          );
        });
      }
      this.renderChart(this.chartData, this.options);
    }, 1000);

    // this.$nextTick(
    //   function() {
    //
    //   }.bind(this)
    // );
    // this.renderChart(this.chartData, this.options);
  },
  methods: {
    createGradient(hexVal, ctx) {
      var ret;

      // If the hex value is valid.
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexVal)) {
        // Getting the content after '#',
        // eg. 'ffffff' in case of '#ffffff'
        ret = hexVal.slice(1);

        // Splitting each character
        ret = ret.split("");

        // Checking if the length is 3
        // then make that 6
        if (ret.length == 3) {
          var ar = [];
          ar.push(ret[0]);
          ar.push(ret[0]);
          ar.push(ret[1]);
          ar.push(ret[1]);
          ar.push(ret[2]);
          ar.push(ret[2]);
          ret = ar;
        }

        // Starts with '0x'(in hexadecimal)
        ret = "0x" + ret.join("");

        // Converting the first 2 characters
        // from hexadecimal to r value
        var r = (ret >> 16) & 255;

        // Converting the second 2 characters
        // to hexadecimal to g value
        var g = (ret >> 8) & 255;

        // Converting the last 2 characters
        // to hexadecimal to b value
        var b = ret & 255;

        // Appending all of them to make
        // the RGBA value
        // return "rgba(" + [r, g, b].join(",") + ",1)";
        var gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, "rgba(" + [r, g, b].join(",") + ",1)");
        gradient.addColorStop(1, "rgba(" + [r, g, b].join(",") + ",0.3)");
        return gradient;
      }
    }
  }
};
</script>
