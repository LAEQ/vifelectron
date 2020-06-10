import ffmpeg from 'fluent-ffmpeg';
import Settings from "../helpers/initialize";

class VideoMeta {
  constructor(video) {
    this.fileKeys = ['filename', 'format_long_name', 'duration', 'size', 'bit_rate']
    this.tagKeys = ['major_brand', 'minor_version', 'encoder']
    this.audioKeys = ['codec_name', 'profile', 'codec_type', 'codec_time_base', 'codec_tag_string', 'sample_fmt', 'sample_rate', 'channels', 'channel_layout', 'duration_ts', 'bit_rate']
    this.videoKeys = ['codec_name', 'codec_type', 'width', 'height', 'avg_frame_rate', 'bit_rate', 'bits_per_raw_sample', 'nb_frames']

    this.settings = new Settings()
    this.video = video
  }

  getMeta(fnc){
    ffmpeg.ffprobe(this.video.path, (err, metadata) =>{
      if(err === null){
        fnc(metadata)
      } else {
        fnc(err)
      }
    })
  }


}

export {VideoMeta}
