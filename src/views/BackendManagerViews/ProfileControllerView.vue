<template>
  <div style="padding: 10px; width: 100%">
    <div style="margin: 10px 0">
      <span>current user: {{user.username}}</span>
    </div>
    <!--    add file-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="addProfile">New Profile</el-button>
    </div>
    <!--    search file by file name-->
    <div style="margin: 10px 0">
      <el-input v-model="query" placeholder="please input information of file name to search" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 7px" @click="load">Search</el-button>
    </div>
    <!--table of data-->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="owner" label="Owner ID">
      </el-table-column>
      <el-table-column prop="username" label="Profile Username">
      </el-table-column>

      <el-table-column label="Header">
        <template #default="imgScope">
          <el-image style="width: 100px; height: 100px" :src="imgScope.row.icon" />
        </template>
      </el-table-column>

      <el-table-column prop="privacy" label="privacy">
      </el-table-column>

      <el-table-column prop="age" label="Age">
      </el-table-column>

      <el-table-column prop="gender" label="Gender">
      </el-table-column>

      <el-table-column prop="online" label="Online">
      </el-table-column>

      <el-table-column prop="oncall" label="Oncall">
      </el-table-column>

      <el-table-column prop="lsatLogin" label="Lsat Login Time">
      </el-table-column>

      <el-table-column fixed="right" label="Operations" width="200px">
        <template #default="scope">

          <el-button type="text" size="small" @click="handleEdit(scope.row)">Edit</el-button>
          <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="text" size="small" >Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
    <!--page control-->
    <div style="margin-top: 15px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      />



    </div>
    <!--    upload file form-->
    <el-dialog id="profileForm" v-model="dialogProfileVisible" :title=dialogProfileTitle width="30%">
      <div style="width: 85%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="Upload Profile Icon">
            <el-upload
                class="avatar-uploader"
                action="http://localhost:9090/file/upload"
                :show-file-list="false"
                :on-change="handleLicensePreview"
                :before-upload="beforeLicenseUpload"
                :on-success="handleAvatarSuccess"
                :headers="uploadHeaders"
            >
              <img v-if="this.img != null" :src="this.img" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="Owner ID">
            <el-input v-model="form.owner" />
          </el-form-item>
          <el-form-item label="Profile Name">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="Privacy">
            <el-radio-group v-model="form.privacy">
              <el-radio :label=1>hide</el-radio>
              <el-radio :label=0>open</el-radio>
            </el-radio-group>

          </el-form-item>
          <el-form-item label="Friend List">
            <el-input v-model="form.friend" />
          </el-form-item>
          <el-form-item label="Hobby List">
            <el-input v-model="form.hobby" />
          </el-form-item>
          <el-form-item label="Age">
            <el-input v-model="form.age" />
          </el-form-item>

          <el-form-item label="Gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="male">Male</el-radio>
              <el-radio label="female">Female</el-radio>
              <el-radio label="secret">Secret</el-radio>
            </el-radio-group>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">Apply</el-button>
            <el-button @click="dialogProfileVisible = false">Cancel</el-button>
          </el-form-item>
        </el-form>


      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import router from "@/router";
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'ProfileControllerView',
  components: {
    Plus
  },
  data(){
    return{
      form: {},
      dialogProfileTitle:"Create new hobby",
      dialogProfileVisible: false,
      isSecondLevel: false,
      version: Math.random(),
      query: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageNum: 10,
      search: '',
      tableData:[

      ],
      img: null,
      user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
      uploadHeaders:{},
    }

  },
  created() {
    this.load();
    // console.log(this.user);
    this.uploadHeaders.token = this.user.token;
    // console.log(this.uploadHeaders);
  },
  methods:{
    onSubmit(){
      if (this.form.id){
        console.log("update");
        request.put("/profile", this.form).then(res =>{
          console.log(res);
          if (res.code === '200'){
            this.$message({
              type: "success",
              message: "Successfully update user"
            })
          }else{
            this.$message({
              type: "error",
              message: res.msg
            })
          }
          this.load();
          this.dialogProfileVisible=false;
        });
      }else{
        console.log("create");
        console.log(this.form);
        if (this.form.level !== 1 && this.form.level !== 2){
          this.form.level = 1;
        }
        console.log(this.form);
        request.post("/profile/create", this.form).then(res =>{
          console.log(res);
          if (res.code === '200'){
            this.$message({
              type: "success",
              message: "Successfully add hobby"
            })
          }else{
            this.$message({
              type: "error",
              message: res.msg
            })
          }
          this.load();
          this.dialogProfileVisible=false;
        });
      }
    },
    handleLicensePreview(res){
      const isLt2M = res.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      } else {
        //store file
        // this.img = URL.createObjectURL(res.raw);
      }
    },
    handleAvatarSuccess(res){
      // console.log(res);
      this.form.icon = res;

      this.img = res;
      // console.log(this.img)
      this.load();
      this.$message({
        type: "success",
        message: "Successfully upload file"
      })
    },
    beforeLicenseUpload(res){
      //console.log(res);
      if (res.type !== 'image/jpeg' && res.type !== 'image/png' && res.type !== 'image/jpg') {
        this.$message({
          type: "error",
          message: 'Avatar picture must be JPG format!'
        })
        return false
      } else if (res.size / 1024 / 1024 > 2) {
        this.$message({
          type: "error",
          message: 'Avatar picture size can not exceed 2MB!'
        })
        return false
      }
      return true

    },
    refreshUser(){
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    },
    // handleClose(){
    //   this.dialogVisible = false;
    // },
    load(){
      this.refreshUser();
      request.get("/profile/page-manager", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          query: this.query
        }
      }).then(res =>{
        console.log(res);
        this.tableData = res.data.records;
        this.total = res.data.total;
      })
    },
    addProfile(){
      this.form = {};
      this.form.gender = "secret";
      this.form.privacy = 0;
      this.img = null;
      this.dialogProfileVisible = true;
      this.fileForm = {};
      this.dialogProfileTitle = "New Profile";
    },
    handleDelete(id){
      //console.log(id)
      request.delete("/profile/" + id).then(res => {
        if (res.code === '200') {
          this.$message({
            type: "success",
            message: "successfully delete"
          })
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        this.load()
      })
    }, handleEdit(row){
      this.form = JSON.parse(JSON.stringify(row));
      this.img = this.form.icon;
      this.dialogProfileVisible = true;
      this.dialogProfileTitle = "Update Profile";
    },handleAccess(row){
      this.form = JSON.parse(JSON.stringify(row));
      console.log(this.form);
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum){
      this.currentPage = pageNum;
      this.load();
    },
  },

}



</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>