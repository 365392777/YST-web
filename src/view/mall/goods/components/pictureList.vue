<template>
	<div>
		<div class="pictureBox">
			<el-upload
				action=""
				:http-request="upload"
				list-type="picture-card"
				:file-list="fileList"
				:on-preview="handlePictureCardPreview"
				:on-remove="handleRemove"
				:on-success="handleSuccess"
				:before-upload="beforeAvatarUpload"
				accept="image/jpeg,image/jpg,image/png"
			>
				<i class="el-icon-circle-plus-outline"></i>
			</el-upload>
			<!-- <div>上传图片</div> -->
		</div>

		<!-- 上传 -->
		<el-dialog :visible.sync="dialogPicture" center>
			<div style="text-align: center;">
		    	<img style="max-width: 100%;" :src="dialogImageUrl" alt="">
			</div>
		</el-dialog>
		<div class="mt20">
			<router-link to="/mall/goods/list">
				<el-button size="small">返回</el-button>
			</router-link>
			<el-button type="primary" size="small" class="ml20" @click="handleSave" :loading="submitLoading">提交</el-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.pictureBox {
	margin-top: 15px;
}
</style>

<script>
import { getGoodsImageList, saveGoodsImageList, saveOneGoodsImage } from '@/api/mall'
import { uploadImage, saveImageData } from '@/api/util'
import request from '@/utils/request'
import { goodsImageUrl } from '@/utils/dev'

export default {
	props: {
		baseId: {
			default: ''
		},
		isEdit: {
			type: Boolean,
			default: false,
		}
	},
    data() {
		return {
			// 商品图片
			id: '',
	     dialogImageUrl: '',
			dialogPicture: false,
			fileList: [],
			images: [],
			submitLoading: false,
			goodsImageUrl,
			deleteImages: [],
		}
	},
	created() {
		if (this.isEdit) {
			let id = this.$route.params && this.$route.params.id
			this.id = id
			this.getDetail(id)
		}
	},
    methods: {
		getDetail(id) {// 获取商品图片
			getGoodsImageList(id).then(res => {
				const data = res.data
				for(let item of data.data) {
					let url = item
					let requestId = item
					url = `${this.goodsImageUrl}${item}`
					this.fileList.push({url, requestId})
				}
			})
		},
		beforeAvatarUpload(file) {
            const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type)
            const isLtM = file.size / 1024 / 1024 < 3
            
            if (!isImage) {
                this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!')
            }
            if (!isLtM) {
                this.$message.error('上传图片大小不能超过 3MB!')
            }
            return isImage && isLtM
        },
        handleRemove(file, fileList) {
			let index = this.fileList.indexOf(file)
			if (file.requestId) {
				this.deleteImages.push(parseInt(file.requestId))
			}
			this.fileList.splice(index, 1)
        },
	    handlePictureCardPreview(file) {
	        this.dialogImageUrl = file.url
	        this.dialogPicture = true
		},
		upload(content) {
			const fd = new FormData()
			fd.append('file', content.file)
			const baseFile = new FormData()
			baseFile.append('multipartFile', content.file)
			let id = this.baseId
			if (this.isEdit) {
				id = this.id
			}
			baseFile.append('relId', id)

			let progressLoad = (progressEvent) => {
                let p = progressEvent
                content.file.percent = progressEvent.loaded / progressEvent.total * 100
                content.onProgress(content.file)
			}
			// uploadImage(fd, progressLoad).then(res => {
			// 	if (res.data.success == 'true') {
					// this.formData.iconId = res.data.data
					let data = {
						// url: res.data,
						baseFile
					}
					content.onSuccess(data)
            //     } else {
			// 		content.onError('上传图片失败')
			// 	}
			// }).catch(err => {
			// 	content.onError('上传图片失败')
			// })
		},
		handleSuccess(res, file, fileList) {
			let url = res.url
			file.baseFile = res.baseFile
			this.fileList = fileList
			// this.fileList.push({url})
		},
		handleSave() {
			let data = []
			let indexList = []
			this.submitLoading = true

			for (let i = 0; i < this.fileList.length; i++) {
				let item = this.fileList[i]
				if (item.baseFile) {
					let post = request.post('/imageRelationOperate/saveOneGoodsImage', item.baseFile)
					data.push(post)
					indexList.push(i)
				}
			}

			request.all(data).then(request.spread((...resList) => {
				for (let i = 0; i < resList.length; i++) {
					let resData = resList[i].data.data
					let index = indexList[i]
					this.fileList[index].requestId = resData.id
				}
				this.saveImages()
			})).catch(res => {
				this.submitLoading = false
			})
		},
		saveImages() {
			this.images = []
			let id = this.baseId
			if (this.isEdit) {
				id = this.id
			}
			for (let item of this.fileList) {
				this.images.push(parseInt(item.requestId))
			}// 保存商品图片
			saveGoodsImageList(id, this.images, this.deleteImages).then(res => {
				const resData = res.data
				if (resData.code == '10001') {
					this.$message.success('保存成功')
					this.deleteImages = []
				} else {
					this.$message.error(resData.msg)
				}
				this.submitLoading = false
			}).catch(err => {
				this.submitLoading = false
			})
		}
    }
}
</script>

<style lang="scss" scoped>
.mt20 {
	margin-top: 20px;
}
</style>
