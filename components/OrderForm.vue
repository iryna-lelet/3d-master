<template>
  <div class="wrapper">
    <el-button type="primary" icon="fa fa-paper-plane" @click="dialogFormVisible = true"> Send to the Server </el-button>
    <el-dialog top="3vh" append-to-body title="Send to the Server" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item :label="firstnameLabel" :class="{ 'error': $v.form.firstname.$error }">
          <el-input v-model="form.firstname" auto-complete="off" placeholder="John" @input="$v.form.firstname.$touch()"></el-input>
        </el-form-item>
        <el-form-item :label="lastnameLabel" :class="{ 'error': $v.form.lastname.$error }">
          <el-input v-model="form.lastname" auto-complete="off" placeholder="Doe" @input="$v.form.lastname.$touch()"></el-input>
        </el-form-item>
        <el-form-item :label="phoneLabel" :class="{ 'error': $v.form.phone.$error }">
          <el-input v-model="form.phone" auto-complete="off" placeholder="+(380) XX-XXX-XXXX" @input="$v.form.phone.$touch()"></el-input>
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
  import { required, alpha, numeric, email } from 'vuelidate/lib/validators'

  export default {
    name: 'OrderForm',
    props: {
      source: Function
    },
    data() {
      return {
        dialogFormVisible: false,
        form: {
          firstname: '',
          lastname: '',
          phone: '',
          email: '',
        }
      };
    },
    validations: {
      form: {
        firstname: {
          required,
          alpha
        },
        lastname: {
          required,
          alpha
        },
        phone: {
          numeric
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
          !this.$v.form.firstname.alpha ? `${firstname} must contain only letters` :
          `${firstname} is invalid`;
      },
      lastnameLabel() {
        const lastname = "Last name";
        return !this.$v.form.lastname.$error ? `${lastname}*` :
          !this.$v.form.lastname.required ? `${lastname} is required` :
          !this.$v.form.lastname.alpha ? `${lastname} must contain only letters` :
          `${lastname} is invalid`;
      },
      phoneLabel() {
        const phone = "Phone number";
        return !this.$v.form.phone.$error ? phone :
          !this.$v.form.phone.numeric ? `${phone} must contain only numbers` :
          `${phone} is invalid`;
      },
      emailLabel() {
        const email = "Email";
        return !this.$v.form.email.$error ? `${email}*` :
          !this.$v.form.email.required ? `${email} is required` :
          !this.$v.form.email.email ? `${email} must be formated` :
          `${email} is invalid`;
      }
    },
    methods: {
      async confirm() {
        try {
          const res = await axios.post('/api/upload', {
            ...this.form,
            source: this.source(),
            model: this.model()
          });
          this.dialogFormVisible = false;
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
</style>
