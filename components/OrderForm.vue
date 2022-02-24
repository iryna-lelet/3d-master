<template>
  <div class="wrapper">
    <el-button type="primary" icon="fa fa-paper-plane" @click="dialogFormVisible = true"> Send to the Server </el-button>
    <el-dialog top="3vh" append-to-body :visible.sync="isInfoPopupVisible">
      <div v-if="this.response === 'Ready!'">
        <h2 class="response-title success">Успіх!</h2>
        <p class="response-text">Дякуємо Вам за використання нашого сервісу!</p>
        <p class="response-text">Шановний {{this.form.firstname}} {{this.form.lastname}}, ваше зображення успішно надіслано.</p>
      </div>
      <div v-else>
        <h2 class="response-title failed">Невдача!</h2>
        <p class="response-text">Повідомлення не надіслано. Повторіть надсилання ще раз!</p>
      </div>
    </el-dialog>
    <el-dialog top="3vh" append-to-body title="Send to the Server" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item :label="firstnameLabel" :class="{ 'error': $v.form.firstname.$error }">
          <el-input v-model="form.firstname" auto-complete="off" placeholder="John" @input="$v.form.firstname.$touch()"></el-input>
        </el-form-item>
        <el-form-item :label="lastnameLabel" :class="{ 'error': $v.form.lastname.$error }">
          <el-input v-model="form.lastname" auto-complete="off" placeholder="Doe" @input="$v.form.lastname.$touch()"></el-input>
        </el-form-item>
        <el-form-item :label="phonenumberLabel" :class="{ 'error': $v.form.phonenumber.$error }">
          <el-input v-model="form.phonenumber" auto-complete="off" placeholder="380 XX-XXX-XXXX" @input="$v.form.phonenumber.$touch()"></el-input>
        </el-form-item>
        <el-form-item :label="emailLabel" :class="{ 'error': $v.form.email.$error }">
          <el-input v-model="form.email" auto-complete="off" placeholder="address@email.com" @input="$v.form.email.$touch()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" :disabled="$v.form.$invalid" @click="confirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { required, alpha, numeric, email, minLength, maxLength } from 'vuelidate/lib/validators'
  const symbolValid = (value) => {
    const regex = /^[A-Za-zА-Яа-я]+$/gi;
    return value.search(regex) !== -1;
  }
  export default {
    name: 'OrderForm',
    props: {
      source: Function,
      modelImage: Function,
    },
    data() {
      return {
        dialogFormVisible: false,
        isInfoPopupVisible: false,
        form: {
          firstname: '',
          lastname: '',
          phonenumber: '',
          email: '',
        },
        response: '',
      };
    },
    validations: {
      form: {
        firstname: {
          required,
          minLength: minLength(2),
          symbolValid
        },
        lastname: {
          required,
          minLength: minLength(2),
          symbolValid
        },
        phonenumber: {
          numeric,
          minLength: minLength(9),
          maxLength: maxLength(15),
        },
        email: {
          required,
          email
        }
      }
    },
    computed: {
      firstnameLabel() {
        const firstname = "First name";
        return !this.$v.form.firstname.$error ? `${firstname}*` :
          !this.$v.form.firstname.required ? `${firstname} is required` :
            !this.$v.form.firstname.symbolValid ? `${firstname} must contain only letters` :
              !this.$v.form.firstname.minLength ? `${firstname} too short` :
                `${firstname} is invalid`;
      },
      lastnameLabel() {
        const lastname = "Last name";
        return !this.$v.form.lastname.$error ? `${lastname}*` :
          !this.$v.form.lastname.required ? `${lastname} is required` :
            !this.$v.form.lastname.symbolValid ? `${lastname} must contain only letters` :
              !this.$v.form.lastname.minLength ? `${lastname} too short` :
                `${lastname} is invalid`;
      },
      phonenumberLabel() {
        const phonenumber = "Phone number";
        return !this.$v.form.phonenumber.$error ? phonenumber :
          !this.$v.form.phonenumber.numeric ? `${phonenumber} must contain only numbers` :
            !this.$v.form.phonenumber.minLength || !this.$v.form.phonenumber.maxLength ? `${phonenumber} does not match the length of the phone number` :
              `${phonenumber} is invalid`;
      },
      emailLabel() {
        const email = "Email";
        return !this.$v.form.email.$error ? `${email}*` :
          !this.$v.form.email.required ? `${email} is required` :
            !this.$v.form.email.email ? `${email} must be formatted` :
              `${email} is invalid`;
      }
    },
    methods: {
      async confirm() {
        try {
          const dataRequest = {
            ...this.form,
            modelImage: this.modelImage()
          }
          this.response = await axios.post("https://yourcups.somee.com/api/UploadFreehostMoj", {
                ...dataRequest
            })
              .then(function (response) {
                return response.data
              })
              .catch(function (error) {
                console.error("Error -> " + error);
              });
          this.dialogFormVisible = false;
          this.isInfoPopupVisible = true
        } catch (err) {
          console.error(err);
        }
      }
    }
  };
</script>

<style>
  .wrapper {
    margin-top: 10px;
  }
  .error .el-input__inner {
    border-color: #f79483;
  }
  .error .el-form-item__label {
    color: #f04124;
  }
  .response-title{
    text-align: center;
    font-size: 30px;
    font-style: italic;
  }
  .response-title.success{
    color: #198754;
  }
  .response-title.failed{
    color: #dc3545;
  }
  .response-text{
    font-size: 18px;
  }
</style>
