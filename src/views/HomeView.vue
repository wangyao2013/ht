<template>
  <div class="home">
    <p>111</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      let obj = {
        name: '222'
      };
      let _name = obj.name;
      Object.defineProperty(obj, 'name', {
        get() {
          return _name;
        },
        set(newVal) {
          console.log(newVal, _name);
          _name = newVal;
        }
      })
      obj.name = '11';
    },
  }

</script>
