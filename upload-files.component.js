import React, { Component } from "react";
import Dropzone from "react-dropzone";
import UploadService from "../services/upload-files.service";

export default class UploadFiles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFiles: undefined,
            progressInfos: [],
            message: [],

            fileInfos: [],
        };
    }

    onDrop(files) {
      const pdfFiles = files.filter(file => file.type === "application/pdf");
      if (pdfFiles.length > 0) {
          this.setState({ selectedFiles: pdfFiles });
      } else {
        this.setState({ message: ["Only PDF files can be uploaded."] });
      }
    }

    uploadFiles() {
        const selectedFiles = this.state.selectedFiles;

        let _progressInfs = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            _progressInfs.push({ percentage: 0, fileNme: selectedFiles[i].name });
        }

        selectedFiles.forEach((file, i) => {
          if (file.type === "application/pdf") {
              this.upload(i, file);
          }
      });

        this.setState(
            {
                progressInfos: _progressInfs,
                message: [],
            },
            () => {
                for (let i = 0; i < selectedFiles.length; i++) {
                    this.uploadFiles(i, selectedFiles[i]);
                }
            }
        );
    }

    
    upload(idx, file) {
        let _progressInfos = [...this.state.progressInfos];
    
        UploadService.upload(file, (event) => {
          _progressInfos[idx].percentage = Math.round(
            (100 * event.loaded) / event.total
          );
          this.setState({
            _progressInfos,
          });
        })
          .then((response) => {
            this.setState((prev) => {
              let nextMessage = [
                ...prev.message,
                "Uploaded the file successfully: " + file.name,
              ];
              return {
                message: nextMessage,
              };
            });
    
            return UploadService.getFiles();
          })
          .then((files) => {
            this.setState({
              fileInfos: files.data,
            });
          })
          .catch(() => {
            _progressInfos[idx].percentage = 0;
            this.setState((prev) => {
              let nextMessage = [
                ...prev.message,
                "Could not upload the file: " + file.name,
              ];
              return {
                progressInfos: _progressInfos,
                message: nextMessage,
              };
            });
          });
      }
        
    componentDidMount() {
        UploadService.getFiles().then((response) => {
          this.setState({
            fileInfos: response.data,
          });
        });
    }

    render() {
        const { selectedFiles, progressInfos, message, fileInfos } = this.state;
    
        return (
          <div>
            {progressInfos &&
              progressInfos.map((progressInfo, index) => (
                <div className="mb-2" key={index}>
                  <span>{progressInfo.fileName}</span>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-info"
                      role="progressbar"
                      aria-valuenow={progressInfo.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: progressInfo.percentage + "%" }}
                    >
                      {progressInfo.percentage}%
                    </div>
                  </div>
                </div>
              ))}
    
            <div className="my-3">
              <Dropzone onDrop={this.onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps({ accept: "application/pdf" })} />
                      {selectedFiles &&
                      Array.isArray(selectedFiles) &&
                      selectedFiles.length ? (
                        <div className="selected-file">
                          {selectedFiles.length > 3
                            ? `${selectedFiles.length} files`
                            : selectedFiles.map((file) => file.name).join(", ")}
                        </div>
                      ) : (
                        `Drag and drop files here, or click to select files`
                      )}
                    </div>
                    <aside className="selected-file-wrapper">
                      <button
                        className="btn btn-success"
                        disabled={!selectedFiles}
                        onClick={this.uploadFiles}
                      >
                        Upload
                      </button>
                    </aside>
                  </section>
                )}
              </Dropzone>
            </div>
    
            {message.length > 0 && (
              <div className="alert alert-secondary" role="alert">
                <ul>
                  {message.map((item, i) => {
                    return <li key={i}>{item}</li>;
                  })}
                </ul>
              </div>
            )}
    
            {fileInfos.length > 0 && (
              <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                  {fileInfos &&
                    fileInfos.map((file, index) => (
                      <li className="list-group-item" key={index}>
                        <a href={file.url}>{file.name}</a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        );
      }

}

