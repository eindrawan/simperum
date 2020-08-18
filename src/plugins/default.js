import Vue from "vue";
import {
  Input,
  Select,
  TextArea,
  Checkbox,
  List,
  Label,
  Map
} from "../components/Forms";
import Page from "../components/Page";
import Grid from "../components/Grid";
import Modal from "../components/Modal";
import Uploader from "../components/Uploader";
import Panel from "../components/Panel";

export default {
  register() {
    Vue.component("Input", Input);
    Vue.component("Select", Select);
    Vue.component("TextArea", TextArea);
    Vue.component("Checkbox", Checkbox);
    Vue.component("Page", Page);
    Vue.component("Grid", Grid);
    Vue.component("Modal", Modal);
    Vue.component("List", List);
    Vue.component("Label", Label);
    Vue.component("Uploader", Uploader);
    Vue.component("Map", Map);
    Vue.component("Panel", Panel);
  }
};
