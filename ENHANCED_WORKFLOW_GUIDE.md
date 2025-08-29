# Coffee Export System - Enhanced Workflow Documentation

## 🏗️ System Architecture Overview

The refactored Coffee Export System follows a layered architecture with clear separation of concerns and standardized interfaces.

## 📊 High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[React Frontend]
        ExportForm[Export Form Component]
        ApproversPanel[Approvers Panel]
        Dashboard[Dashboard Components]
    end
    
    subgraph "API Gateway Layer"
        Gateway[API Gateway]
        Middleware[Middleware Stack]
        subgraph "Middleware Components"
            Recovery[Recovery Middleware]
            Logging[Logging Middleware]
            CORS[CORS Middleware]
            RateLimit[Rate Limiting]
            Auth[Authentication]
        end
    end
    
    subgraph "Validation Services Layer"
        NBValidator[National Bank Validator]
        BankValidator[Exporter Bank Validator]
        QualityValidator[Quality Authority Validator]
        CustomsValidator[Customs Validator]
    end
    
    subgraph "Blockchain Layer"
        SmartContract[Smart Contract v2.0]
        subgraph "Smart Contract Services"
            ValidationSvc[Validation Service]
            AuditSvc[Audit Service]
            PaymentSvc[Payment Service]
        end
        SharedUtils[Shared Blockchain Utils]
    end
    
    subgraph "Storage Layer"
        IPFS[IPFS Storage]
        PrivateData[Private Data Collections]
        BlockchainLedger[Blockchain Ledger]
        CouchDB[CouchDB State Database]
    end
    
    subgraph "Infrastructure Layer"
        Docker[Docker Containers]
        Network[Hyperledger Fabric Network]
        Monitoring[Health & Metrics]
    end
    
    UI --> Gateway
    Gateway --> Middleware
    Middleware --> Recovery
    Middleware --> Logging
    Middleware --> CORS
    Middleware --> RateLimit
    Middleware --> Auth
    
    Gateway --> NBValidator
    Gateway --> BankValidator
    Gateway --> QualityValidator
    Gateway --> CustomsValidator
    
    Gateway --> SmartContract
    SmartContract --> ValidationSvc
    SmartContract --> AuditSvc
    SmartContract --> PaymentSvc
    SmartContract --> SharedUtils
    
    SmartContract --> IPFS
    SmartContract --> PrivateData
    SmartContract --> BlockchainLedger
    BlockchainLedger --> CouchDB
    
    NBValidator --> Docker
    BankValidator --> Docker
    QualityValidator --> Docker
    CustomsValidator --> Docker
    SmartContract --> Network
    
    Gateway --> Monitoring
    NBValidator --> Monitoring
    BankValidator --> Monitoring
    QualityValidator --> Monitoring
    CustomsValidator --> Monitoring
```

## 🔄 Enhanced Export Submission Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Frontend
    participant GW as API Gateway
    participant SC as Smart Contract
    participant AS as Audit Service
    participant VS as Validation Service
    participant V1 as National Bank
    participant V2 as Exporter Bank
    participant V3 as Quality Authority
    participant V4 as Customs
    participant IPFS as IPFS Storage
    participant BC as Blockchain

    Note over U,BC: 1. Document Preparation & Upload
    U->>UI: Fill Export Form
    UI->>UI: Validate Form Data
    UI->>IPFS: Upload Documents
    IPFS-->>UI: Return IPFS CIDs
    UI->>UI: Generate Document Hashes
    
    Note over U,BC: 2. Export Submission
    UI->>GW: POST /api/exports
    GW->>GW: Middleware Processing
    GW->>GW: Request Validation
    GW->>GW: Authentication Check
    GW->>SC: Submit Export Request
    
    Note over U,BC: 3. Smart Contract Processing
    SC->>SC: Validate Export Request
    SC->>AS: Create Initial Audit Entry
    SC->>BC: Store Export in Private Data
    SC->>VS: Initialize Validation Summary
    SC->>BC: Emit Validation Events
    
    Note over U,BC: 4. Parallel Document Validation
    par National Bank Validation
        BC->>V1: Validation Event (LICENSE)
        V1->>V1: Validate License Document
        V1->>GW: Return Validation Result
        GW->>SC: Record Validation Result
        SC->>AS: Update Audit Trail
    and Exporter Bank Validation
        BC->>V2: Validation Event (INVOICE)
        V2->>V2: Validate Invoice Document
        V2->>GW: Return Validation Result
        GW->>SC: Record Validation Result
        SC->>AS: Update Audit Trail
    and Quality Authority Validation
        BC->>V3: Validation Event (QUALITY)
        V3->>V3: Validate Quality Certificate
        V3->>GW: Return Validation Result
        GW->>SC: Record Validation Result
        SC->>AS: Update Audit Trail
    and Customs Validation
        BC->>V4: Validation Event (SHIPPING)
        V4->>V4: Validate Shipping Documents
        V4->>GW: Return Validation Result
        GW->>SC: Record Validation Result
        SC->>AS: Update Audit Trail
    end
    
    Note over U,BC: 5. Final Processing
    SC->>SC: Check All Validations Complete
    alt All Documents Approved
        SC->>SC: Update Status to APPROVED
        SC->>AS: Record Final Approval
        SC->>BC: Emit Export Approved Event
        BC-->>UI: Notify Export Approved
    else Any Document Rejected
        SC->>SC: Update Status to REJECTED
        SC->>AS: Record Final Rejection
        SC->>BC: Emit Export Rejected Event
        BC-->>UI: Notify Export Rejected
    end
    
    Note over U,BC: 6. Payment Processing (if approved)
    alt Export Approved
        V2->>GW: POST /api/release-payment
        GW->>SC: Release Payment Request
        SC->>SC: Verify Approval Status
        SC->>SC: Update Status to PAYMENT_RELEASED
        SC->>AS: Record Payment Release
        SC->>BC: Emit Payment Released Event
        BC-->>UI: Notify Payment Released
    end
```

## 📋 Document Approval Workflow

```mermaid
graph TD
    A[Document Submitted] --> B{Document Hash Valid?}
    B -->|No| C[Return Hash Invalid Error]
    B -->|Yes| D[Store in IPFS]
    D --> E[Generate Document Metadata]
    E --> F[Store in Private Data Collection]
    F --> G[Emit Validation Event]
    
    G --> H[Route to Appropriate Validator]
    H --> I{Document Type}
    
    I -->|LICENSE| J[National Bank Validator]
    I -->|INVOICE| K[Exporter Bank Validator]
    I -->|QUALITY| L[Quality Authority Validator]
    I -->|SHIPPING| M[Customs Validator]
    
    J --> N[Check License Registry]
    K --> O[Check Invoice Registry]
    L --> P[Check Quality Registry]
    M --> Q[Check Shipping Registry]
    
    N --> R{Document Found & Valid?}
    O --> R
    P --> R
    Q --> R
    
    R -->|Yes| S[Return Validation Success]
    R -->|No| T[Return Validation Failure]
    
    S --> U[Record Validation Result]
    T --> U
    
    U --> V[Update Validation Summary]
    V --> W[Add Audit Trail Entry]
    W --> X{All Docs Validated?}
    
    X -->|No| Y[Wait for More Validations]
    X -->|Yes| Z{All Docs Approved?}
    
    Z -->|Yes| AA[Update Status to APPROVED]
    Z -->|No| BB[Update Status to REJECTED]
    
    AA --> CC[Emit Export Approved Event]
    BB --> DD[Emit Export Rejected Event]
    
    CC --> EE[Enable Payment Processing]
    DD --> FF[End Process]
    
    Y --> G
    EE --> GG[Payment Release Workflow]
    FF --> HH[Archive Export Request]
```

## 🔍 Validation Service Architecture

```mermaid
graph TB
    subgraph "Validator Service Architecture"
        subgraph "Request Processing"
            Request[HTTP Request]
            CORS[CORS Middleware]
            Logging[Request Logging]
            Validation[Input Validation]
        end
        
        subgraph "Core Logic"
            Registry[Document Registry]
            ValidateLogic[Validation Logic]
            Response[Response Builder]
        end
        
        subgraph "Monitoring & Metrics"
            Metrics[Metrics Collection]
            Health[Health Checks]
            Status[Status Monitoring]
        end
        
        subgraph "Configuration"
            EnvConfig[Environment Config]
            ValidHashes[Valid Hash Registry]
            ServiceConfig[Service Configuration]
        end
    end
    
    Request --> CORS
    CORS --> Logging
    Logging --> Validation
    Validation --> ValidateLogic
    ValidateLogic --> Registry
    Registry --> Response
    Response --> Metrics
    
    ValidateLogic --> EnvConfig
    Registry --> ValidHashes
    Health --> ServiceConfig
    
    Metrics --> Health
    Health --> Status
```

## 🏃 API Gateway Request Flow

```mermaid
graph LR
    subgraph "Request Processing Pipeline"
        A[HTTP Request] --> B[Recovery Middleware]
        B --> C[Logging Middleware]
        C --> D[CORS Middleware]
        D --> E[Rate Limiting]
        E --> F[Authentication]
        F --> G[Request Validation]
        G --> H[Route to Handler]
        
        H --> I{Handler Type}
        I -->|Export| J[Export Handler]
        I -->|Approval| K[Approval Handler]
        I -->|Health| L[Health Handler]
        I -->|Status| M[Status Handler]
        
        J --> N[Smart Contract Call]
        K --> O[Validator Service Call]
        L --> P[Health Check Logic]
        M --> Q[System Status Logic]
        
        N --> R[Standardized Response]
        O --> R
        P --> R
        Q --> R
        
        R --> S[Response Middleware]
        S --> T[HTTP Response]
    end
```

## 📊 Data Flow Architecture

```mermaid
graph TB
    subgraph "Data Storage Layers"
        subgraph "Application Layer"
            Frontend[Frontend State]
            APICache[API Response Cache]
        end
        
        subgraph "Gateway Layer"
            GatewayMemory[Gateway Memory]
            RequestMetrics[Request Metrics]
        end
        
        subgraph "Validation Layer"
            ValidatorRegistries[Validator Registries]
            ValidationMetrics[Validation Metrics]
        end
        
        subgraph "Blockchain Layer"
            PrivateData[Private Data Collections]
            StateDB[State Database]
            Ledger[Immutable Ledger]
        end
        
        subgraph "External Storage"
            IPFS[IPFS Distributed Storage]
            CouchDB[CouchDB Indexes]
        end
    end
    
    Frontend --> APICache
    APICache --> GatewayMemory
    GatewayMemory --> RequestMetrics
    
    GatewayMemory --> ValidatorRegistries
    ValidatorRegistries --> ValidationMetrics
    
    GatewayMemory --> PrivateData
    PrivateData --> StateDB
    StateDB --> Ledger
    
    StateDB --> CouchDB
    PrivateData --> IPFS
    
    Frontend -.->|Document Upload| IPFS
    Ledger -.->|Audit Trail| Frontend
```

## 🔐 Security & Authentication Flow

```mermaid
graph TD
    A[Client Request] --> B{Request Type}
    B -->|Public| C[Health/Status Endpoints]
    B -->|Protected| D[Authentication Required]
    
    D --> E{Environment}
    E -->|Development| F[Allow All Requests]
    E -->|Production| G[Validate JWT Token]
    
    G --> H{Token Valid?}
    H -->|No| I[Return 401 Unauthorized]
    H -->|Yes| J[Extract User Claims]
    
    J --> K[Check User Permissions]
    K --> L{Permission Valid?}
    L -->|No| M[Return 403 Forbidden]
    L -->|Yes| N[Proceed to Handler]
    
    F --> N
    C --> N
    
    N --> O[Rate Limiting Check]
    O --> P{Rate Limit OK?}
    P -->|No| Q[Return 429 Rate Limited]
    P -->|Yes| R[Process Request]
    
    R --> S[Generate Response]
    S --> T[Add Security Headers]
    T --> U[Return Response]
```

## 📈 Monitoring & Health Check Architecture

```mermaid
graph TB
    subgraph "Monitoring Stack"
        subgraph "Service Level"
            HealthEndpoints[/health Endpoints]
            MetricsEndpoints[/metrics Endpoints]
            StatusEndpoints[/status Endpoints]
        end
        
        subgraph "Application Level"
            RequestMetrics[Request Metrics]
            ResponseTimes[Response Times]
            ErrorRates[Error Rates]
            BusinessMetrics[Business Metrics]
        end
        
        subgraph "Infrastructure Level"
            ContainerHealth[Container Health]
            NetworkHealth[Network Health]
            StorageHealth[Storage Health]
        end
        
        subgraph "Alerting"
            HealthDashboard[Health Dashboard]
            Alerts[Alert System]
            Notifications[Notifications]
        end
    end
    
    HealthEndpoints --> RequestMetrics
    MetricsEndpoints --> ResponseTimes
    StatusEndpoints --> ErrorRates
    
    RequestMetrics --> BusinessMetrics
    ResponseTimes --> BusinessMetrics
    ErrorRates --> BusinessMetrics
    
    BusinessMetrics --> ContainerHealth
    ContainerHealth --> NetworkHealth
    NetworkHealth --> StorageHealth
    
    StorageHealth --> HealthDashboard
    HealthDashboard --> Alerts
    Alerts --> Notifications
```

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Deployment Environment"
        subgraph "Container Layer"
            FrontendContainer[Frontend Container]
            GatewayContainer[API Gateway Container]
            ValidatorContainers[Validator Containers]
            BlockchainNodes[Blockchain Node Containers]
        end
        
        subgraph "Storage Layer"
            IPFSNodes[IPFS Node Containers]
            CouchDBContainers[CouchDB Containers]
            VolumeStorage[Persistent Volumes]
        end
        
        subgraph "Network Layer"
            LoadBalancer[Load Balancer]
            ServiceMesh[Service Mesh]
            NetworkPolicies[Network Policies]
        end
        
        subgraph "Monitoring Layer"
            LogAggregation[Log Aggregation]
            MetricsCollection[Metrics Collection]
            HealthChecks[Health Checks]
        end
    end
    
    LoadBalancer --> FrontendContainer
    LoadBalancer --> GatewayContainer
    
    GatewayContainer --> ValidatorContainers
    GatewayContainer --> BlockchainNodes
    
    BlockchainNodes --> IPFSNodes
    BlockchainNodes --> CouchDBContainers
    
    CouchDBContainers --> VolumeStorage
    IPFSNodes --> VolumeStorage
    
    ServiceMesh --> NetworkPolicies
    
    FrontendContainer --> LogAggregation
    GatewayContainer --> LogAggregation
    ValidatorContainers --> LogAggregation
    
    LogAggregation --> MetricsCollection
    MetricsCollection --> HealthChecks
```

## 📝 Summary

The enhanced workflow documentation provides:

1. **Clear Architecture Overview**: Layered architecture with defined responsibilities
2. **Detailed Process Flows**: Step-by-step workflows for all major operations
3. **Service Interactions**: How components communicate and integrate
4. **Data Flow Patterns**: How data moves through the system
5. **Security Models**: Authentication and authorization flows
6. **Monitoring Strategy**: Health checks and metrics collection
7. **Deployment Topology**: Container and infrastructure architecture

This documentation serves as a comprehensive guide for developers, operators, and stakeholders to understand the refactored system's architecture and workflows.