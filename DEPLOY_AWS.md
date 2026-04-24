# Deploying CineSearch on AWS with a Load Balancer 🚀

This guide walks you through deploying CineSearch on **two EC2 instances** behind an **Application Load Balancer (ALB)** — all within the **AWS Free Tier**.

---

## 📐 Architecture Overview

```
                    ┌──────────────────────┐
                    │      Internet        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Application Load    │
                    │  Balancer (ALB)      │
                    │  Port 80 (HTTP)      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
        ┌────────▼────────┐        ┌─────────▼───────┐
        │   EC2 Instance  │        │   EC2 Instance   │
        │   (Target 1)    │        │   (Target 2)     │
        │   t2.micro      │        │   t2.micro       │
        │   Nginx :80     │        │   Nginx :80      │
        │   AZ: us-east-1a│        │   AZ: us-east-1b │
        └─────────────────┘        └──────────────────┘
```

**How it works:** Users hit the ALB URL → ALB distributes traffic across your two EC2 instances using round-robin → each instance serves the CineSearch static files via Nginx.

---

## 💰 Free Tier Costs

| Resource | Free Tier Allowance | Our Usage |
|----------|-------------------|-----------|
| EC2 (t2.micro) | 750 hrs/month | ~1440 hrs (2 instances × 720 hrs) — **keep one instance if exceeding** |
| ALB | 750 hrs/month + 15 LCUs | ~720 hrs — ✅ within limits |
| EBS Storage | 30 GB total | ~16 GB (8 GB × 2) — ✅ within limits |
| Data Transfer | 100 GB/month outbound | Minimal — ✅ within limits |

> ⚠️ **Important:** Running 2 × t2.micro instances = 1440 hrs, which exceeds the 750 hr limit. You have two options:
> 1. Run both instances only during your **demo/presentation** and terminate after.
> 2. Use `t2.micro` for one and accept a small charge (~$4/month) for the second.
>
> For a college project demo, Option 1 is best — spin up, demo, then **terminate everything** to avoid charges.

---

## 🛠️ Step-by-Step Deployment

### Prerequisites

- An [AWS Free Tier account](https://aws.amazon.com/free/)
- Your project pushed to a **GitHub repository** (or have the `dist/` folder ready to upload)
- A terminal/SSH client (use **PowerShell** on Windows or the AWS CloudShell)

---

### Step 1: Build Your App Locally

On your local machine, build the production bundle:

```bash
npm run build
```

This creates a `dist/` folder with all the static files (HTML, CSS, JS).

> 💡 **Tip:** Verify the build works by running `npm run preview` and checking `http://localhost:4173`

---

### Step 2: Create a VPC (or Use the Default VPC)

AWS gives you a **Default VPC** in every region. We'll use it.

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. **Set your region** to `us-east-1` (N. Virginia) — this has the best free tier support
3. Go to **VPC** → **Your VPCs** → Confirm you see a "Default VPC"
4. Go to **VPC** → **Subnets** → Note that you have subnets in **at least 2 Availability Zones** (e.g., `us-east-1a` and `us-east-1b`). The ALB requires subnets in 2 different AZs.

> ✅ The default VPC is preconfigured with an Internet Gateway, route tables, and public subnets — no extra setup needed.

---

### Step 3: Create a Security Group for EC2 Instances

1. Go to **EC2** → **Security Groups** → **Create Security Group**
2. Configure:
   - **Name:** `cinesearch-ec2-sg`
   - **Description:** `Allow HTTP and SSH for CineSearch EC2 instances`
   - **VPC:** Select your default VPC
3. **Inbound rules:**

   | Type | Port | Source | Purpose |
   |------|------|--------|---------|
   | SSH | 22 | My IP | SSH access for setup |
   | HTTP | 80 | Anywhere (0.0.0.0/0) | Serve website |

4. **Outbound rules:** Leave as default (allow all outbound)
5. Click **Create Security Group**

---

### Step 4: Create a Security Group for the ALB

1. Go to **EC2** → **Security Groups** → **Create Security Group**
2. Configure:
   - **Name:** `cinesearch-alb-sg`
   - **Description:** `Allow HTTP traffic to the ALB`
   - **VPC:** Select your default VPC
3. **Inbound rules:**

   | Type | Port | Source | Purpose |
   |------|------|--------|---------|
   | HTTP | 80 | Anywhere (0.0.0.0/0) | Public web access |

4. **Outbound rules:** Leave as default
5. Click **Create Security Group**

> 💡 **Security Best Practice:** After creating the ALB SG, go back and **edit** the EC2 SG's HTTP rule. Change the source from `0.0.0.0/0` to the **ALB Security Group** (`cinesearch-alb-sg`). This ensures only the ALB can access your EC2 instances on port 80.

---

### Step 5: Create a Key Pair (for SSH Access)

1. Go to **EC2** → **Key Pairs** → **Create Key Pair**
2. Configure:
   - **Name:** `cinesearch-key`
   - **Type:** RSA
   - **Format:** `.pem` (for OpenSSH / PowerShell) or `.ppk` (for PuTTY on Windows)
3. The key will automatically download. **Save it securely** — you cannot download it again!

---

### Step 6: Launch EC2 Instance 1

1. Go to **EC2** → **Instances** → **Launch Instance**
2. Configure:
   - **Name:** `CineSearch-Server-1`
   - **AMI:** Amazon Linux 2023 (Free tier eligible)
   - **Instance type:** `t2.micro` (Free tier eligible)
   - **Key pair:** Select `cinesearch-key`
   - **Network settings:**
     - VPC: Default VPC
     - Subnet: Choose one in **us-east-1a**
     - Auto-assign public IP: **Enable**
     - Security group: Select `cinesearch-ec2-sg`
   - **Storage:** 8 GB gp3 (default is fine)
3. **Expand "Advanced details"** and paste this into the **User Data** field:

```bash
#!/bin/bash
# Update system
yum update -y

# Install Nginx
yum install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Clean default Nginx content
rm -rf /usr/share/nginx/html/*

# Create a placeholder page (we'll upload real files later)
cat > /usr/share/nginx/html/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head><title>CineSearch - Server 1</title></head>
<body>
  <h1>🎬 CineSearch - Server 1 is Running!</h1>
  <p>Nginx is serving on this instance. Upload your dist/ files to replace this page.</p>
</body>
</html>
HTMLEOF

# Set permissions
chmod -R 755 /usr/share/nginx/html
```

4. Click **Launch Instance**

---

### Step 7: Launch EC2 Instance 2

Repeat **Step 6** with these changes:
- **Name:** `CineSearch-Server-2`
- **Subnet:** Choose one in **us-east-1b** (a **different** AZ than Instance 1)
- **User Data:** Same script but change `Server 1` to `Server 2` in the placeholder HTML

---

### Step 8: Upload Your Built App to Both Instances

Wait for both instances to show **"Running"** status and pass **2/2 status checks** (takes ~2-3 minutes).

#### 8a. Get Instance Public IPs
Go to **EC2** → **Instances** → Note the **Public IPv4 address** for each instance.

#### 8b. Upload dist/ Files via SCP

Open **PowerShell** and navigate to your project folder:

```powershell
# Upload to Instance 1 (replace <IP1> with actual IP)
scp -i "path\to\cinesearch-key.pem" -r .\dist\* ec2-user@<IP1>:/tmp/cinesearch/

# Upload to Instance 2 (replace <IP2> with actual IP)
scp -i "path\to\cinesearch-key.pem" -r .\dist\* ec2-user@<IP2>:/tmp/cinesearch/
```

#### 8c. SSH into Each Instance and Move Files

```bash
# SSH into Instance 1
ssh -i "path\to\cinesearch-key.pem" ec2-user@<IP1>

# On the instance, run:
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r /tmp/cinesearch/* /usr/share/nginx/html/
sudo chmod -R 755 /usr/share/nginx/html
sudo systemctl restart nginx

# Verify by opening http://<IP1> in your browser
# Then type 'exit' to disconnect
```

Repeat for **Instance 2** with `<IP2>`.

> ✅ **Checkpoint:** At this point, visiting `http://<IP1>` and `http://<IP2>` in your browser should show CineSearch running independently on both servers.

---

### Step 9: Create a Target Group

1. Go to **EC2** → **Target Groups** → **Create Target Group**
2. Configure:
   - **Target type:** Instances
   - **Name:** `cinesearch-tg`
   - **Protocol:** HTTP
   - **Port:** 80
   - **VPC:** Default VPC
   - **Health check protocol:** HTTP
   - **Health check path:** `/`
3. Click **Next**
4. **Register targets:** Select both `CineSearch-Server-1` and `CineSearch-Server-2`, click **"Include as pending below"**
5. Click **Create Target Group**

---

### Step 10: Create the Application Load Balancer

1. Go to **EC2** → **Load Balancers** → **Create Load Balancer**
2. Select **Application Load Balancer** → **Create**
3. Configure:
   - **Name:** `cinesearch-alb`
   - **Scheme:** Internet-facing
   - **IP address type:** IPv4
   - **Network mapping:**
     - VPC: Default VPC
     - Select subnets in **at least 2 Availability Zones** (us-east-1a and us-east-1b)
   - **Security group:** Select `cinesearch-alb-sg` (remove the default SG)
   - **Listeners:**
     - Protocol: HTTP, Port: 80
     - Default action: Forward to → `cinesearch-tg`
4. Click **Create Load Balancer**

---

### Step 11: Verify the Load Balancer

1. Wait for the ALB state to change from **"Provisioning"** to **"Active"** (~2-5 minutes)
2. Go to **Target Groups** → `cinesearch-tg` → **Targets** tab
   - Both instances should show **"healthy"** status
3. Copy the **ALB DNS name** (e.g., `cinesearch-alb-123456789.us-east-1.elb.amazonaws.com`)
4. Open it in your browser — **🎉 CineSearch is live behind a load balancer!**

> 💡 **Verify load balancing works:** You can add a small visual indicator to each server's `index.html` (e.g., a footer saying "Served by Instance 1" vs "Instance 2"), then hard-refresh the ALB URL multiple times to see traffic switching between instances.

---

## 🧪 Testing the Load Balancer (For Your Demo)

### Test 1: Round-Robin Distribution

To prove the ALB is distributing traffic, add a server identifier:

```bash
# SSH into Instance 1
ssh -i "cinesearch-key.pem" ec2-user@<IP1>
sudo bash -c 'echo "<div style=\"position:fixed;bottom:10px;right:10px;background:#10b981;color:white;padding:8px 16px;border-radius:8px;font-family:sans-serif;font-size:12px;z-index:9999;\">Server 1</div>" >> /usr/share/nginx/html/index.html'

# SSH into Instance 2
ssh -i "cinesearch-key.pem" ec2-user@<IP2>
sudo bash -c 'echo "<div style=\"position:fixed;bottom:10px;right:10px;background:#f59e0b;color:white;padding:8px 16px;border-radius:8px;font-family:sans-serif;font-size:12px;z-index:9999;\">Server 2</div>" >> /usr/share/nginx/html/index.html'
```

Now refresh the ALB URL — you'll see the badge switch between **"Server 1"** (green) and **"Server 2"** (amber).

### Test 2: Fault Tolerance

1. Go to **EC2** → **Instances**
2. Select `CineSearch-Server-1` → **Instance State** → **Stop Instance**
3. Refresh the ALB URL — it still works! The ALB automatically routes all traffic to `Server 2`
4. **Start** `Server 1` again — traffic resumes across both instances

### Test 3: Health Checks

1. Go to **EC2** → **Target Groups** → `cinesearch-tg` → **Targets**
2. Observe the **Health status** column — healthy instances are green, stopped ones show "unused/unhealthy"
3. This proves automatic health monitoring

---

## 🧹 Cleanup (VERY IMPORTANT — Avoid Charges!)

After your demo, **delete everything** in this order:

1. **Load Balancer:** EC2 → Load Balancers → Select `cinesearch-alb` → Actions → Delete
2. **Target Group:** EC2 → Target Groups → Select `cinesearch-tg` → Actions → Delete
3. **EC2 Instances:** EC2 → Instances → Select both → Instance State → **Terminate**
4. **Security Groups:** EC2 → Security Groups → Delete `cinesearch-alb-sg` and `cinesearch-ec2-sg`
5. **Key Pair:** EC2 → Key Pairs → Delete `cinesearch-key`

> 🔴 **DO NOT skip cleanup!** A running ALB + 2 EC2 instances will cost ~$30/month after free tier limits.

---

## 📸 Screenshots to Capture (For Your Report)

For your cloud computing project report, take screenshots of:

1. ✅ **EC2 Dashboard** — showing both instances running
2. ✅ **Target Group** — showing both targets as "healthy"
3. ✅ **Load Balancer** — showing the ALB is active with the DNS name
4. ✅ **Security Groups** — showing inbound rules for both SGs
5. ✅ **CineSearch via ALB URL** — the app running in browser (with ALB DNS in the address bar)
6. ✅ **Server 1 badge** and **Server 2 badge** — proving round-robin
7. ✅ **Fault tolerance** — app still working after stopping one instance
8. ✅ **Architecture diagram** — use the one at the top of this guide

---

## 📋 Quick Reference

| Resource | Value |
|----------|-------|
| Region | `us-east-1` (N. Virginia) |
| Instance Type | `t2.micro` |
| AMI | Amazon Linux 2023 |
| Web Server | Nginx |
| ALB Port | 80 (HTTP) |
| EC2 SG | `cinesearch-ec2-sg` |
| ALB SG | `cinesearch-alb-sg` |
| Target Group | `cinesearch-tg` |
| Key Pair | `cinesearch-key` |

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't SSH into instance | Check SG has port 22 open to "My IP"; verify key pair permissions |
| ALB shows "unhealthy" targets | SSH into instance, run `sudo systemctl status nginx`, check if Nginx is running |
| SCP upload fails | Ensure you're using `ec2-user@<IP>` (not `root`); check key file path |
| App loads but no movies | The OMDb API key is baked into the build — rebuild with correct `.env` values |
| ALB still "provisioning" | Wait 3-5 minutes; check that you selected subnets in 2 different AZs |
| Page shows Nginx default page | Files weren't copied — SSH in and verify `/usr/share/nginx/html/` has your `index.html` |

---

## 🏆 What You've Demonstrated

By completing this deployment, you've shown:

- **Load Balancing** — Distributing traffic across multiple servers
- **High Availability** — App survives single server failure  
- **Health Checks** — Automatic monitoring and routing away from unhealthy instances
- **Cloud Infrastructure** — VPC, subnets, security groups, and EC2 configuration
- **Web Server Configuration** — Nginx serving a production React build

Good luck with your project! 🎬✨
