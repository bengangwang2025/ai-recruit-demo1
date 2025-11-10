
let selectedFiles = [];
const analysisResults = [];

// Mock data
const mockData = {
    jobs: [
        { id: 'frontend', title: '高级前端工程师', company: 'A公司', applicants: 10 },
        { id: 'pm', title: '产品经理', company: 'B公司', applicants: 8 },
        { id: 'ui', title: 'UI设计师', company: 'C公司', applicants: 12 }
    ],
    candidates: [
        {
            id: 1,
            name: '张三',
            age: 28,
            job: 'frontend',
            scores: {
                total: 92,
                professional: 95,
                communication: 88
            },
            evaluation: '候选人展现出优秀的技术功底和清晰的表达能力。在视频中展示了对前端技术的深入理解，并能够流畅地阐述复杂的技术概念。沟通风格专业且富有亲和力，这表明其具备良好的团队协作潜力。'
        }
    ]
};

// 工具函数
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 处理视频上传
function handleUpload(companyId) {
    const fileInput = document.getElementById(`video-${companyId}`);
    let file = fileInput.files[0];
    
    if (!file) {
        alert('未选择视频文件，将使用演示视频进行演示');
        // 创建一个虚拟的文件名用于演示
        file = {
            name: '自我介绍视频_演示.mp4',
            size: 15000000 // 15MB
        };
    }

    // 显示上传弹窗
    const modal = document.getElementById('upload-modal');
    modal.classList.add('show');
    
    // 模拟上传进度
    let progress = 0;
    const progressBar = document.getElementById('upload-progress');
    const statusText = document.getElementById('upload-status');
    
    // 重置进度条和状态
    progressBar.style.width = '0%';
    statusText.textContent = '正在上传...';
    
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            statusText.textContent = '上传成功！';
            setTimeout(() => {
                modal.classList.remove('show');
                // 重置上传控件
                fileInput.value = '';
                alert('视频上传成功！我们会尽快为您进行分析并通知您结果。');
            }, 1000);
        }
    }, 100);
}

// 处理企业评价表单
function showEvaluationForm(candidateId) {
    const modal = document.getElementById('evaluation-modal');
    modal.setAttribute('aria-hidden', 'false');
    modal.dataset.candidateId = candidateId;
}

function closeEvaluationForm() {
    const modal = document.getElementById('evaluation-modal');
    modal.setAttribute('aria-hidden', 'true');
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 如果在个人页面，初始化文件输入框的监听
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        const button = input.nextElementSibling;
        
        // 初始状态设置
        button.textContent = '上传视频';
        
        // 文件选择改变时的处理
        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                button.textContent = '上传视频';
            }
        });
    });

    // 如果在详情页面，加载候选人数据
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('job');
        // 这里可以根据jobId加载对应的候选人数据
    }

    // 如果存在评价表单，添加提交处理
    const evaluationForm = document.getElementById('evaluation-form');
    if (evaluationForm) {
        evaluationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const modal = document.getElementById('evaluation-modal');
            const candidateId = modal.dataset.candidateId;
            alert('已成功添加对候选人的评价！');
            closeEvaluationForm();
        });
    }
});

function generateResult(filename) {
  const baseSkill = randInt(75,95);
  const baseSoft = randInt(70,90);
  const baseCulture = randInt(68,88);
  const score = Math.round((baseSkill*0.5 + baseSoft*0.3 + baseCulture*0.2));
  
  const comments = [
    "培训风格轻松，与学员非常融洽",
    "亲和力强，语言逻辑清晰",
    "对专业知识理解深刻",
    "表现出良好的团队协作能力",
    "富有激情和创新精神"
  ];
  
  return {
    filename,
    scores: {
      skill: baseSkill,
      soft: baseSoft,
      culture: baseCulture,
      total: score
    },
    comment: comments[randInt(0, comments.length-1)]
  };
}

function showResults() {
  document.getElementById('processing').style.display = 'none';
  document.getElementById('processing').setAttribute('aria-hidden','true');
  document.getElementById('results').style.display = 'block';
  document.getElementById('results').setAttribute('aria-hidden','false');

  const container = document.getElementById('resultsContainer');
  
  analysisResults.forEach(result => {
    container.innerHTML += `
      <div class="result-card">
        <h3>${result.filename}</h3>
        <div class="metrics">
          <div class="metric">
            <div class="value">${result.scores.total}%</div>
            <div class="label">综合匹配度</div>
          </div>
          <div class="metric">
            <div class="value">${result.scores.skill}%</div>
            <div class="label">专业能力</div>
          </div>
          <div class="metric">
            <div class="value">${result.scores.soft}%</div>
            <div class="label">软实力</div>
          </div>
        </div>
        <div class="comment">${result.comment}</div>
      </div>
    `;
  });
}

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('processing').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('videoFile').value = '';
  document.getElementById('selectedFiles').innerHTML = '';
  document.getElementById('progress').style.width = '0%';
  document.getElementById('progressText').innerText = '等待中';
  document.getElementById('currentFileName').textContent = '-';
  document.getElementById('fileProgress').textContent = '0/0';
  selectedFiles = [];
  analysisResults.length = 0;
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const report = analysisResults.map(result => `
候选人视频: ${result.filename}
综合匹配度: ${result.scores.total}%
专业能力: ${result.scores.skill}%
软实力: ${result.scores.soft}%
评价: ${result.comment}
----------------------------------------
`).join('\n');

  const blob = new Blob([report], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '分析报告.txt';
  a.click();
  URL.revokeObjectURL(url);
});

function onload() {
  document.getElementById('results').style.display = 'none';
}
